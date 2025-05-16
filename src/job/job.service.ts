import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Job, Prisma } from '@prisma/client';
import { CreateJobDto } from './dto/create-job-dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { JobPhotosService } from 'src/job-photos/job-photos.service';

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private jobPhotosService: JobPhotosService,
  ) {}

  async getJobs(): Promise<Job[]> {
    return this.prisma.client.job.findMany({
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
    return this.prisma.client.job.findUnique({
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
    console.log('data', data);
    const dto = plainToInstance(CreateJobDto, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const customer = await this.prisma.client.user.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${data.customerId} not found`,
      );
    }

    try {
      const jobData: Prisma.JobCreateInput = {
        name: data.name,
        payment: data.payment,
        cover: data.cover,
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
            assignedAt: new Date(),
          })),
        },
        locations: data.locationIds
          ? {
              create: data.locationIds.map((locationId) => ({
                location: {
                  connect: { id: locationId },
                },
                assignedAt: new Date(),
              })),
            }
          : undefined,
      };

      const job = await this.prisma.client.job.create({
        data: jobData,
        include: {
          customer: true,
          categories: { include: { category: true } },
          locations: { include: { location: true } },
          photos: true,
        },
      });

      const workType = await Promise.all(
        data.categoryIds.map(async (categoryId) => {
          const category = await this.prisma.client.category.findUnique({
            where: { id: categoryId },
          });
          return category?.name;
        }),
      ).then((names) => names.join(', '));

      const jobName = data.name;

      // Upload de fotos
      if (files && files.length > 0) {
        this.jobPhotosService.uploadPhotos(
          String(job.id),
          files,
          workType,
          jobName,
        );
      }

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

    const job = await this.prisma.client.job.findUnique({
      where,
      include: {
        categories: { include: { category: true } },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job not found`);
    }

    try {
      const updateData: Prisma.JobUpdateInput = {
        name: data.name, // Novo campo name
        payment: data.payment,
        cover: data.cover,
        customerLink: data.customerLink,
        discount: data.discount,
        closingDate: data.closingDate,
        eventDate: data.eventDate,
        gift: data.gift,
      };

      if (data.customerId) {
        const customer = await this.prisma.client.user.findUnique({
          where: { id: data.customerId },
        });
        if (!customer) {
          throw new NotFoundException(
            `Customer with ID ${data.customerId} not found`,
          );
        }
        updateData.customer = { connect: { id: data.customerId } };
      }

      if (data.categoryIds) {
        await this.prisma.client.jobCategory.deleteMany({
          where: { jobId: where.id },
        });
        updateData.categories = {
          create: data.categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
            assignedAt: new Date(),
          })),
        };
      }

      if (data.locationIds) {
        await this.prisma.client.jobLocation.deleteMany({
          where: { jobId: where.id },
        });
        updateData.locations = {
          create: data.locationIds.map((locationId) => ({
            location: {
              connect: { id: locationId },
            },
            assignedAt: new Date(),
          })),
        };
      }

      const updatedJob = await this.prisma.client.job.update({
        where,
        data: updateData,
        include: {
          customer: true,
          categories: { include: { category: true } },
          locations: { include: { location: true } },
          photos: true,
        },
      });

      // Atualizar fotos
      const workType =
        data.categoryIds
          ?.map((categoryId) => {
            const category = job.categories.find(
              (cat) => cat.category.id === categoryId,
            );
            return category?.category.name;
          })
          .join(', ') ||
        job.categories.map((category) => category.category.name).join(', ');

      const jobName = data.name || job.name;

      if (files && files.length > 0) {
        await this.jobPhotosService.uploadPhotos(
          String(updatedJob.id),
          files,
          workType,
          jobName,
        );
      }

      return updatedJob;
    } catch (error) {
      throw new BadRequestException(`Failed to update job: ${error.message}`);
    }
  }

  async deleteJob(where: Prisma.JobWhereUniqueInput): Promise<Job> {
    await this.prisma.client.jobCategory.deleteMany({
      where: { jobId: where.id },
    });

    await this.prisma.client.jobLocation.deleteMany({
      where: { jobId: where.id },
    });

    return this.prisma.client.job.delete({
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
