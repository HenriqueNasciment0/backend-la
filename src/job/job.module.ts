import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JobPhotosModule } from 'src/job-photos/job-photos.module';

@Module({
  imports: [PrismaModule, JobPhotosModule],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
