import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { LocationModule } from './location/location.module';
import { JobModule } from './job/job.module';
import { PinataModule } from './pinata/pinata.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    LocationModule,
    JobModule,
    PinataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
