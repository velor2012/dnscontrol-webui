
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class ShellService {
  async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}