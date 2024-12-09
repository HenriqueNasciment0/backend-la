import { Module } from '@nestjs/common';
import { PinataService } from './pinata.service';
import { PinataController } from './pinata.controller';

@Module({
  providers: [PinataService],
  exports: [PinataService],
  controllers: [PinataController],
})
export class PinataModule {}
