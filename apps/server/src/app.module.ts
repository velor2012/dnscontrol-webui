import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileController } from './api/file/file.controller';
import { FileService } from './api/file/file.service';
import { ConfigModule } from '@nestjs/config';
import { DomainService } from './api/domain/domain.service';
import { DomainController } from './api/domain/domain.controller';
import CustomConfig from './config'
import { BaseController } from './api/base/base.controller';
import { BaseService } from './api/base/base.service';
import { DnsController } from './api/dns/dns.controller';
import { DnsService } from './api/dns/dns.service';
import { ShellService } from './api/lib/shell.service';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load:[CustomConfig]
  })],
  controllers: [AppController, FileController, DomainController, DnsController, BaseController],
  providers: [AppService, FileService, DomainService, DnsService, BaseService, ShellService],
})
export class AppModule {}
