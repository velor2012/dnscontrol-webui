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
 domainProviderMap = this.config.get('domainProviderMap');

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
    if(!(domain in this.domainProviderMap)){
        throw new HttpException(`域名：${domain} 不存在`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    const filePath = path.join(scanPath, domain + '.'+ this.domainProviderMap[domain] +'.js')

    // console.log(`domain: ${domain}, domainProviderMap: ${this.domainProviderMap}`)
    try{
        const res = await fs.writeFile(filePath, content);
        return res;
    }catch(e){
        throw new HttpException(`保存文件：${path} 失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return "" ;
  }

  async addDomain(domain: string, provider: string) {
    const scanPath = this.config.get('dirPath');
    const filePath = path.join(scanPath, domain + '.' + provider + '.js')
    try{
        const cred = JSON.parse(this.getCred())
        if(!provider || !(provider in cred)){
            throw new HttpException(`provider ${provider} 不存在`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if(fssync.existsSync(filePath) || domain in this.domainProviderMap)
        {
            throw new HttpException(`域名：${domain} 已存在`, HttpStatus.INTERNAL_SERVER_ERROR)
        } 
        this.domainProviderMap[domain] = provider
        this.config.set('domainProviderMap', this.domainProviderMap);
        const res = await fs.writeFile(filePath, "");
        return res;
    }catch(e){
        throw new HttpException(`添加 ${domain} 失败, Execption:${e}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return "" ;
  }

  async delDomain(domain: string) {
    const scanPath = this.config.get('dirPath');
    if(!(domain in this.domainProviderMap)){
        throw new HttpException(`域名：${domain} 不存在`, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    const provider = this.domainProviderMap[domain]
    const filePath = path.join(scanPath, domain + '.' + provider + '.js')
    const bkPath = path.join(scanPath, domain + '.' + provider + '.js.bk')

    try{
        if(!fssync.existsSync(filePath))
        {
            throw new HttpException(`域名：${domain} 不存在`, HttpStatus.INTERNAL_SERVER_ERROR)
        } 

        const res = await fs.unlink(filePath);
        if(fssync.existsSync(bkPath)){
            fs.unlink(bkPath);
        }
        delete this.domainProviderMap[domain]
        console.log(`delete domainProviderMap: ${domain}, after delete->domainProviderMap: ${JSON.stringify(this.domainProviderMap)}`)
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
                let arrs = item.name.split('.')
                if(arrs.length > 2){
                    // 去掉最后的.js
                    arrs.splice(arrs.length - 1, 1)
                    // 去掉最后的provider
                    const provider = arrs.splice(arrs.length - 1, 1)[0]
                    return instanceToPlain({
                        domain: arrs.join('.'),
                        provider
                    })
                }
                return ""
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
    if(!(domain in this.domainProviderMap)){
        throw new HttpException(`域名：${domain} 不存在`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    const filePath = path.join(scanPath, domain + '.' + this.domainProviderMap[domain] + '.js')
    return this.fileService.getFile(filePath);
  }
  getCred() : string {
    const credPath = this.config.get('credPath');
    return this.fileService.getFile(credPath);
  }
  async updateCred(content: string) {
        try{
            const cred = JSON.parse(content)
        }catch(e){
            throw new HttpException(`cred格式错误`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        const credPath = this.config.get('credPath');
        return await this.fileService.saveFile(content, credPath);
    }
}
