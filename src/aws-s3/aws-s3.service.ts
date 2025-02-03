import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.AWS_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Upload a file to a specific folder in S3.
   * @param file - The file to be uploaded.
   * @param workType - The type of work (e.g., "weddings").
   * @param workName - The name of the specific work (e.g., "joao-maria").
   * @returns The S3 key of the uploaded file.
   */
  async uploadFileToFolder(
    file: Express.Multer.File,
    workType: string,
    workName: string,
  ): Promise<string> {
    const fileKey = `${workType.replace(/\s/g, '')}/${workName.replace(/\s/g, '')}/${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return fileKey;
  }

  /**
   * Upload multiple files to a specific folder in S3.
   * @param files
   * @param workType
   * @param workName
   * @returns An array of S3 keys for the uploaded files.
   */
  async uploadFilesToFolder(
    files: Express.Multer.File[],
    workType: string,
    workName: string,
  ): Promise<string[]> {
    return Promise.all(
      files.map((file) => this.uploadFileToFolder(file, workType, workName)),
    );
  }

  /**
   * Generate signed URLs for multiple files in S3.
   * @param fileKeys - An array of S3 keys.
   * @returns An array of signed URLs to access the files.
   */
  async generateSignedUrls(fileKeys: string[]): Promise<string[]> {
    return Promise.all(
      fileKeys.map((fileKey) => this.generateSignedUrl(fileKey)),
    );
  }

  /**
   * Upload multiple files to S3, organize them in folders, and generate signed URLs.
   * @param files - An array of files to be uploaded.
   * @param workType
   * @param workName
   * @returns An array of signed URLs for the uploaded files.
   */
  async uploadAndGenerateUrls(
    files: Express.Multer.File[],
    workType: string,
    workName: string,
  ): Promise<string[]> {
    const fileKeys = await this.uploadFilesToFolder(files, workType, workName);
    return this.generateSignedUrls(fileKeys);
  }

  /**
   * Generate a signed URL to access a file in S3.
   * @param fileKey - The key of the file in S3.
   * @returns A signed URL to access the file.
   */
  async generateSignedUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  /**
   * Delete a file from S3.
   * @param fileKey - The key of the file to be deleted.
   */
  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    await this.s3Client.send(command);
  }
}
