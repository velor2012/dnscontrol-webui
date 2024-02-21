import { Body, Controller, Get, Post, Query, Header, StreamableFile } from '@nestjs/common';
import { FileService } from './file.service';
import { getFilesDto } from 'src/dto/getFiles.dto';
import { getFileDto } from 'src/dto/getFile.dto';
import { saveFileDto } from 'src/dto/saveFile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('list')
  getFiles(@Query() query: getFilesDto) {
    return this.fileService.getFiles(query.path);
  }

  @Post()
   saveFile(@Body() saveFileDto: saveFileDto) {
    return this.fileService.saveFile(saveFileDto.content, saveFileDto.path);
  }

  @Get('content')
//   @Header('Content-Type', 'binary/octet-stream')
  getFileContent(@Query() getFilesDto: getFileDto) : string {
    let t = this.fileService.getFile(getFilesDto.path);
    return t;
  }
}
