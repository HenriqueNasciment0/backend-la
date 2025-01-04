import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Job, Prisma } from '@prisma/client';
import { CreateJobDto } from './dto/create-job-dto';
import { PinataService } from 'src/pinata/pinata.service';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private pinataService: PinataService,
  ) {}

  async getJobs(): Promise<Job[]> {
    return this.prisma.job.findMany({
      include: {
        customer: true,
        categories: { include: { category: true } },
        locations: { include: { location: true } },
        payments: { include: { payment: true } },
        photos: true,
      },
    });
  }

  async getJobById(where: Prisma.JobWhereUniqueInput): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where,
      include: {
        customer: true,
        categories: {
          include: {
            category: true,
          },
        },
        locations: {
          include: {
            location: true,
          },
        },
        photos: true,
      },
    });
  }

  async createJob(
    data: CreateJobDto,
    files?: Express.Multer.File[],
  ): Promise<Job> {
    // Validate customer
    const dto = plainToInstance(CreateJobDto, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new BadRequestException('Validation failed');
    }
    console.log('Validated and transformed DTO:', dto);

    const customer = await this.prisma.user.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${data.customerId} not found`,
      );
    }
    console.log('customer', customer);

    // Validate categories
    for (const categoryId of data.categoryIds) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
    }

    // Validate locations
    if (data.locationIds) {
      for (const locationId of data.locationIds) {
        const location = await this.prisma.location.findUnique({
          where: { id: locationId },
        });
        if (!location) {
          throw new NotFoundException(
            `Location with ID ${locationId} not found`,
          );
        }
      }
    }

    // Create Pinata group for job photos
    const photoGroup = await this.pinataService.createGroup(
      `Job-${data.customerId}-Photos`,
    );

    // Upload photos to Pinata
    const photoUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await this.pinataService.uploadFileToGroup(
          photoGroup.id,
          file,
        );
        photoUrls.push(uploadResult.url);
      }
    }

    try {
      const job = await this.prisma.job.create({
        data: {
          payment: data.payment,
          customerLink: data.customerLink,
          discount: data.discount,
          closingDate: data.closingDate,
          eventDate: data.eventDate,
          gift: data.gift,
          customer: {
            connect: { id: data.customerId },
          },
          categories: {
            create: data.categoryIds.map((categoryId) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          },
          locations: data.locationIds
            ? {
                create: data.locationIds.map((locationId) => ({
                  location: {
                    connect: { id: locationId },
                  },
                })),
              }
            : undefined,
          photos: {
            create: photoUrls.map((url) => ({
              photoUrl: url,
            })),
          },
        },
        include: {
          customer: true,
          categories: {
            include: {
              category: true,
            },
          },
          locations: {
            include: {
              location: true,
            },
          },
          photos: true,
        },
      });

      return job;
    } catch (error) {
      throw new BadRequestException(`Failed to create job: ${error.message}`);
    }
  }

  async updateJob(
    params: {
      where: Prisma.JobWhereUniqueInput;
      data: Partial<CreateJobDto>;
    },
    files?: Express.Multer.File[],
  ): Promise<Job> {
    const { where, data } = params;
    const job = await this.prisma.job.findUnique({ where });

    if (!job) {
      throw new NotFoundException(`Job not found`);
    }

    if (data.customerId) {
      const customer = await this.prisma.user.findUnique({
        where: { id: data.customerId },
      });
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${data.customerId} not found`,
        );
      }
    }

    if (data.categoryIds) {
      for (const categoryId of data.categoryIds) {
        const category = await this.prisma.category.findUnique({
          where: { id: categoryId },
        });
        if (!category) {
          throw new NotFoundException(
            `Category with ID ${categoryId} not found`,
          );
        }
      }
    }

    if (data.locationIds) {
      for (const locationId of data.locationIds) {
        const location = await this.prisma.location.findUnique({
          where: { id: locationId },
        });
        if (!location) {
          throw new NotFoundException(
            `Location with ID ${locationId} not found`,
          );
        }
      }
    }

    const photoUrls: string[] = [];
    if (files && files.length > 0) {
      // Create or reuse existing Pinata group
      const photoGroup = await this.pinataService.createGroup(
        `Job-${job.customerId}-Photos`,
      );

      for (const file of files) {
        const uploadResult = await this.pinataService.uploadFileToGroup(
          photoGroup.id,
          file,
        );
        photoUrls.push(uploadResult.url);
      }
    }

    try {
      return await this.prisma.job.update({
        where,
        data: {
          payment: data.payment,
          customerLink: data.customerLink,
          discount: data.discount,
          closingDate: data.closingDate,
          eventDate: data.eventDate,
          gift: data.gift,
          customer: data.customerId
            ? { connect: { id: data.customerId } }
            : undefined,
          categories: data.categoryIds
            ? {
                deleteMany: { jobId: job.id },
                create: data.categoryIds.map((categoryId) => ({
                  category: { connect: { id: categoryId } },
                })),
              }
            : undefined,
          locations: data.locationIds
            ? {
                deleteMany: { jobId: job.id },
                create: data.locationIds.map((locationId) => ({
                  location: { connect: { id: locationId } },
                })),
              }
            : undefined,
          photos:
            photoUrls.length > 0
              ? {
                  create: photoUrls.map((url) => ({
                    photoUrl: url,
                  })),
                }
              : undefined,
        },
        include: {
          customer: true,
          categories: { include: { category: true } },
          locations: { include: { location: true } },
          photos: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to update job: ${error.message}`);
    }
  }

  async deleteJob(where: Prisma.JobWhereUniqueInput): Promise<Job> {
    await this.prisma.jobCategory.deleteMany({
      where: { jobId: where.id },
    });

    await this.prisma.jobLocation.deleteMany({
      where: { jobId: where.id },
    });

    return this.prisma.job.delete({
      where,
      include: {
        customer: true,
        categories: {
          include: {
            category: true,
          },
        },
        locations: {
          include: {
            location: true,
          },
        },
      },
    });
  }
}
