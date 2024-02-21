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
    if (dirPath != "" && credPath != "") {
        customInit({
            dirPath,
            credPath
        })
    }
    return {
        dirPath,
        credPath
    }
  };