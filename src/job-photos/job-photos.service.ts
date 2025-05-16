import { Injectable, BadRequestException } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobPhotosService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly prisma: PrismaService,
  ) {}

  async uploadPhotos(
    jobId: string,
    files: Express.Multer.File[],
    workType: string,
    workName: string,
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided for upload.');
    }

    const fileKeys = await Promise.all(
      files.map((file) =>
        this.awsS3Service.uploadFileToFolder(file, workType, workName),
      ),
    );

    await this.prisma.client.jobPhoto.createMany({
      data: fileKeys.map((fileKey) => ({
        photoUrl: fileKey,
        jobId: Number(jobId),
      })),
    });

    return fileKeys;
  }
}
