import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { FileService } from '../file/file.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  controllers: [DomainController],
  providers: [DomainService, FileService],
})
export class DomainModule {}
