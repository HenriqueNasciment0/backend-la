import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { LocationModule } from './location/location.module';
import { JobModule } from './job/job.module';
import { PaymentModule } from './payment/payment.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { JobPhotosModule } from './job-photos/job-photos.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    LocationModule,
    JobModule,
    PaymentModule,
    AwsS3Module,
    JobPhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
