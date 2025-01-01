import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PinataModule } from 'src/pinata/pinata.module';

@Module({
  imports: [PrismaModule, PinataModule],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
