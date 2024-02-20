import { Body, Controller, Get, Post, Query, Header, StreamableFile, Put, Delete } from '@nestjs/common';
import { DomainService } from './domain.service';
import { getFilesDto } from 'src/dto/getFiles.dto';
import { getFileDto } from 'src/dto/getFile.dto';
import { saveFileDto } from 'src/dto/saveFile.dto';
import { ApiTags } from '@nestjs/swagger';
import { getDomainDetailDto } from 'src/dto/getDomainDetail.dto';
import { addDomainDto } from 'src/dto/addDomain.dto';
import { saveDomainDto } from 'src/dto/saveDomain.dto';
import { saveCredDto } from 'src/dto/saveCred.dto';
import { delDomainDto } from 'src/dto/delDomain.dto';

@ApiTags('domain')
@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get('list')
  listDomain() {
    return this.domainService.listDomain();
  }

  @Post()
   addDomain(@Body() addDomainDto: addDomainDto) {
    return this.domainService.addDomain(addDomainDto.domain);
  }

  @Put()
   saveDomain(@Body() saveDomainDto: saveDomainDto) {
    return this.domainService.saveDomain(saveDomainDto.domain, saveDomainDto.content);
  }

  @Delete()
   delDomain(@Body() delDomainDto: delDomainDto) {
    return this.domainService.delDomain(delDomainDto.domain);
  }

  
  @Get('content')
  getDomain(@Query() getDomainDetailDto: getDomainDetailDto) : string {
    let t = this.domainService.getDomainDetail(getDomainDetailDto.domain);
    return t;
  }

  @Get('cred')
  getCred() : string {
    let t = this.domainService.getCred();
    return t;
  }

  @Put('cred')
  updateCred(@Body() saveCredDto: saveCredDto) : string {
    this.domainService.updateCred(saveCredDto.content);
    return "ok";
  }
}
