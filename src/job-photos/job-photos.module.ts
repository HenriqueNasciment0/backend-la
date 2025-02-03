import { Module } from '@nestjs/common';
import { JobPhotosService } from './job-photos.service';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [JobPhotosService, AwsS3Service, PrismaService],
  exports: [JobPhotosService],
})
export class JobPhotosModule {}
