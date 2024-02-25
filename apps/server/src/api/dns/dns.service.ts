import { HttpException, HttpStatus, Injectable, StreamableFile  } from '@nestjs/common';
import * as dree from 'dree';   
import { ConfigService } from '@nestjs/config';
import { ShellService } from '../lib/shell.service';


@Injectable()
export class DnsService {
 constructor(private shellService: ShellService, private config: ConfigService) {}
    // 只允许访问指定目录
 baseTree = dree.scan(process.env.BASE_PATH);
 domainProviderMap = this.config.get('domainProviderMap');

 async flushDns(domain: string, dnsProvider?: string) {
    if(dnsProvider == null || dnsProvider == undefined || dnsProvider == ""){
        if(!(domain in this.domainProviderMap)){
            throw new HttpException(`未找到域名${domain}的dns配置`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        dnsProvider = this.domainProviderMap[domain] || process.env.DEFAULT_PROVIDER;
    }
    try{
        const res = await this.shellService.executeCommand(`cd configs/zones && dnscontrol push --config ${domain}.${dnsProvider}.js`);
        return res;
    }catch(e){
        console.log(`获取dns记录失败: ${e}`)
        throw new HttpException(`获取dns记录失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async reloadDns(domain: string, dnsProvider?: string) {
    if(dnsProvider == null || dnsProvider == undefined || dnsProvider == ""){
        if(!(domain in this.domainProviderMap)){
            throw new HttpException(`未找到域名${domain}的dns配置`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        dnsProvider = this.domainProviderMap[domain] || process.env.DEFAULT_PROVIDER;
    }
    try{
        const res = await this.shellService.executeCommand(`cd configs/zones && dnscontrol get-zones --format=js --out=draft.${domain}.js ${dnsProvider} - ${domain}`);
        const res2 = await this.shellService.executeCommand(`cd configs/zones && cp ${domain}.${dnsProvider}.js ${domain}.${dnsProvider}.js.bk && cp draft.${domain}.js ${domain}.${dnsProvider}.js`);
        const res3 = await this.shellService.executeCommand(`cd configs/zones && rm draft.${domain}.js`);
        return res;
    }catch(e){
        console.log(`获取dns记录失败: ${e}`)
        throw new HttpException(`获取dns记录失败`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return "" ;
  }
}
