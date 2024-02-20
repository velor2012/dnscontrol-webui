import { HttpException, HttpStatus, Injectable, StreamableFile  } from '@nestjs/common';
import * as dree from 'dree';   
const path = require('path');
import * as fs from 'node:fs/promises';
import * as fssync from 'node:fs';
import { ConfigService } from '@nestjs/config';

function isSubPath(subPath, parentPath) {
  const relativePath = path.relative(parentPath, subPath);
//   console.log("relativePath: ", relativePath)
//   console.log("path: ", path)
//   console.log("path.isAbsolute(relativePath): ", path.isAbsolute(relativePath))
  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

@Injectable()
export class FileService {
 constructor(private config: ConfigService) {}
    // 只允许访问指定目录
 scanPath = this.config.get('dirPath');
 baseTree = dree.scan(this.scanPath);

  getFiles(path: string): any {
    const options = {
        stat: false,
        normalize: true,
        followLinks: true,
        size: true,
        hash: true,
        depth: 1,
      };
    if(path == undefined || path == null || path == ""){
        path = this.scanPath;
    }
    const tree = dree.scan(path, options);
    if(!isSubPath(tree.path, this.baseTree.path)){
        throw new HttpException('非法访问', HttpStatus.UNAUTHORIZED)
    }
    return tree ;
  }

  // path需要包括文件名
  async saveFile(content: string, path: string) {
    try{
        const res = await fs.writeFile(path, content);
        return res;
    }catch(e){
        throw new HttpException(`保存文件：${path} 失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return "" ;
  }

   getFile(path: string): string  {
    // 检查path是否存在
    try{
        //读取文件
        console.log("path: ", path)
        const res = fssync.readFileSync(path, 'utf8');
        // const file = fssync.createReadStream(path);
        // console.log(res)
        if(!isSubPath(path, this.baseTree.path)){
            throw new HttpException('非法访问', HttpStatus.UNAUTHORIZED)
        }
        return res;
    }catch(e){
        if(e instanceof HttpException){
            throw e
        }
        if(e.code == 'ENOENT'){
            throw new HttpException(`文件：${path} 不存在`, HttpStatus.NOT_FOUND)
        }else if(e.code == 'EISDIR'){
            throw new HttpException(`路径：${path} 是一个目录`, HttpStatus.BAD_REQUEST)
        }
        console.log(`读取文件：${path} 失败`,e)
        throw new HttpException(`读取文件：${path} 失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
