import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [LocationService],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
