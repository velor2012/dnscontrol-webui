import * as path from 'node:path';
import customInit from './init'
import * as fssync from 'node:fs';
import * as fs from 'node:fs/promises';
export default () => {
    let dirPath = ""
    let credPath = ""
    console.log(process.env.BASE_PATH, process.env.ZONES_NAME, process.env.CREDS_NAME)
    if(process.env.BASE_PATH != undefined && process.env.ZONES_NAME  != undefined){
        dirPath = path.join(process.env.BASE_PATH, process.env.ZONES_NAME)
        if(fssync.existsSync(process.env.BASE_PATH) == false) {
            fssync.mkdirSync(process.env.BASE_PATH)
        }
        if(fssync.existsSync(dirPath) == false) {
            fssync.mkdirSync(dirPath)
        }
    }
    if( process.env.BASE_PATH &&  process.env.ZONES_NAME && process.env.CREDS_NAME ){
        credPath = path.join(process.env.BASE_PATH, process.env.ZONES_NAME, process.env.CREDS_NAME)
        if(fssync.existsSync(credPath) == false) {
            // 新建文件
            fs.writeFile(credPath, "")
        }
    }

    let domainProviderMap = {}
    let providerDomainMap = {}
    if (dirPath != "" && credPath != "") {
        // 读取已经配置的域名/提供商信息
        var files = fssync.readdirSync(dirPath);
        domainProviderMap = {}
        files.forEach(function (filename) {
            console.log('filename: ', filename)
            // 不断拼接直到找到文件
            let arrs = filename.split('.')
            if(arrs.length > 2){
                // 去掉最后的.js
                arrs.splice(arrs.length - 1, 1)
                // 去掉最后的provider
                const provider = arrs.splice(arrs.length - 1, 1)[0]
                const domain = arrs.join('.')
                domainProviderMap[domain] = provider
                providerDomainMap[provider] = domain
            }
            
        })

        customInit({
            dirPath,
            credPath
        })
    }
    return {
        dirPath,
        credPath,
        domainProviderMap,
        providerDomainMap
    }
  };