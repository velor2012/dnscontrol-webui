import { ensureFileSync, ensureDirSync } from 'fs-extra'

// const path = require('path');
const init = (config: any)=>{
    // console.log(process.env)
    const dir_path = config.dirPath
    // const dir_path = path.join("process.env.BASE_PATH", "rocess.env.ZONES_NAME")
    const cred_path = config.credPath
    // // 检查path是否存在

    ensureDirSync(dir_path)
    ensureFileSync(cred_path)
}
export default init