import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PinataService } from './pinata.service';

@Controller('pinata')
export class PinataController {
  constructor(private readonly pinataService: PinataService) {}

  @Post('create-group')
  async createGroup(@Body('name') name: string) {
    return this.pinataService.createGroup(name);
  }

  @Post('upload-to-group')
  @UseInterceptors(FilesInterceptor('files', 30))
  async uploadToGroup(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('groupId') groupId: string,
  ) {
    const results = [];
    for (const file of files) {
      const result = await this.pinataService.uploadFileToGroup(groupId, file);
      results.push(result);
    }
    return results;
  }
}
