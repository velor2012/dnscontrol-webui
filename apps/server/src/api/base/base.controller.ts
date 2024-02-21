import {  Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseService } from './base.service';

@ApiTags('base')
@Controller('base')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get('check')
  getCred() : Promise<string> {
    return this.baseService.checkDnscontrolExist();
  }
}
