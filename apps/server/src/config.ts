import * as path from 'node:path';
import customInit from './init'
export default () => {
    let dirPath = ""
    let credPath = ""
    console.log(process.env.BASE_PATH, process.env.ZONES_NAME, process.env.CREDS_NAME)
    if(process.env.BASE_PATH != undefined && process.env.ZONES_NAME  != undefined){
        dirPath = path.join(process.env.BASE_PATH, process.env.ZONES_NAME)
    }
    if( process.env.BASE_PATH &&  process.env.ZONES_NAME && process.env.CREDS_NAME ){
        credPath = path.join(process.env.BASE_PATH, process.env.ZONES_NAME, process.env.CREDS_NAME)
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