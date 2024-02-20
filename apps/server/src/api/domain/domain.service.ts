import { HttpException, HttpStatus, Injectable, StreamableFile  } from '@nestjs/common';
import * as dree from 'dree';   
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as fssync from 'node:fs';
import {instanceToPlain} from "class-transformer";
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';

function isSubPath(subPath, parentPath) {
  const relativePath = path.relative(parentPath, subPath);
//   console.log("relativePath: ", relativePath)
//   console.log("path: ", path)
//   console.log("path.isAbsolute(relativePath): ", path.isAbsolute(relativePath))
  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}


@Injectable()
export class DomainService {
 constructor(private fileService: FileService, private config: ConfigService) {}
    // 只允许访问指定目录
 baseTree = dree.scan(process.env.BASE_PATH);

  getFiles(path: string): any {
    const options = {
        stat: false,
        normalize: true,
        followLinks: true,
        size: true,
        hash: true,
        depth: 1,
      };
    const tree = dree.scan(path, options);
    if(!isSubPath(tree.path, this.baseTree.path)){
        throw new HttpException('非法访问', HttpStatus.UNAUTHORIZED)
    }
    return tree ;
  }

  // path需要包括文件名
  async saveDomain(domain: string, content: string) {
    const scanPath = this.config.get('dirPath');
    const filePath = path.join(scanPath, domain + '.js')
    try{
        const res = await fs.writeFile(filePath, content);
        return res;
    }catch(e){
        throw new HttpException(`保存文件：${path} 失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return "" ;
  }

  async addDomain(domain: string) {
    const scanPath = this.config.get('dirPath');
    const filePath = path.join(scanPath, domain + '.js')
    try{
        if(fssync.existsSync(filePath))
        {
            throw new HttpException(`域名：${domain} 已存在`, HttpStatus.INTERNAL_SERVER_ERROR)
        } 

        const res = await fs.writeFile(filePath, "");
        return res;
    }catch(e){
        throw new HttpException(`添加 ${domain} 失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return "" ;
  }

  async delDomain(domain: string) {
    const scanPath = this.config.get('dirPath');
    const filePath = path.join(scanPath, domain + '.js')
    try{
        if(!fssync.existsSync(filePath))
        {
            throw new HttpException(`域名：${domain} 不存在`, HttpStatus.INTERNAL_SERVER_ERROR)
        } 

        const res = await fs.unlink(filePath);
        return res;
    }catch(e){
        throw new HttpException(`删除 ${domain} 失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return "" ;
  }

  async listDomain(){
    const scanPath = this.config.get('dirPath');
    try{
        const res = this.fileService.getFiles(scanPath)
        const filterStr = 'js'
        // console.log(res.children)
        if(res.children && res.children.length > 0){
            return (res.children as Array<any>)
            .filter((item)=>{
                return item.extension == filterStr && item.name.indexOf('draft') != 0
            })
            .map((item)=>{
                return instanceToPlain(path.basename(item.name, '.' + filterStr));
            })
        }
        return []
    }catch(e){
        console.error(e)
        throw new HttpException(`获取域名列表失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  getDomainDetail(domain: string) : string {
    const scanPath = this.config.get('dirPath');
    const filePath = path.join(scanPath, domain + '.js')
    return this.fileService.getFile(filePath);
  }
  getCred() : string {
    const credPath = this.config.get('credPath');
    return this.fileService.getFile(credPath);
  }
  async updateCred(content: string) {
        const credPath = this.config.get('credPath');
        return await this.fileService.saveFile(content, credPath);
    }
}
