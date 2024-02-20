import { Module } from '@nestjs/common';
import { DnsController } from './dns.controller';
import { DnsService } from './dns.service';
import { ShellService } from '../lib/shell.service';

@Module({
  imports: [],
  controllers: [DnsController],
  providers: [DnsService, ShellService],
})
export class DnsModule {}
