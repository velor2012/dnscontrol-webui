import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
const { exec } = require('child_process');

function os_func() {
  this.execCommand = function (cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  };
}
var os = new os_func();

@Injectable()
export class BaseService {
  constructor() {}

  async checkDnscontrolExist(): Promise<string> {
    try {
      const res = await os.execCommand('dnscontrol -h');
      return res;
    } catch (err) {
      throw new HttpException(
        'dnscontrol不存在',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
