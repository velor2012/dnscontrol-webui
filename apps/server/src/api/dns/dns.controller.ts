import { Body, Controller, Get, Post, Query, Header, StreamableFile, Put, Delete, Param } from '@nestjs/common';
import { DnsService } from './dns.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { flushDnsDto } from 'src/dto/flushDns.dto';

@ApiTags('dns')
@Controller('dns')
export class DnsController {
  constructor(private readonly dnsService: DnsService) {}

  @ApiOperation({ summary: '将本地dns配置刷新到云厂商' })
  @Post('flush')
   addDns(@Body() flushDnsDto: flushDnsDto) {
    return this.dnsService.flushDns(flushDnsDto.domain, flushDnsDto.dnsProvider);
  }

  @ApiOperation({ summary: '将云厂商的记录刷新到本地' })
  @Get('reload')
   reloadDns(@Query() query: flushDnsDto){
    // console.log("domains: ", query)
    return this.dnsService.reloadDns(query.domain, query.dnsProvider);
  }
}
