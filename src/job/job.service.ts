import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Job, Prisma } from '@prisma/client';
import { CreateJobDto } from './dto/create-job-dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async getJobs(): Promise<Job[]> {
    return this.prisma.job.findMany({
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
      },
    });
  }

  async createJob(data: CreateJobDto): Promise<Job> {
    const customer = await this.prisma.user.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${data.customerId} not found`,
      );
    }

    for (const categoryId of data.categoryIds) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
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

    try {
      return await this.prisma.job.create({
        data: {
          payment: data.payment,
          photos: data.photos,
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
        },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to create job: ${error.message}`);
    }
  }

  async updateJob(params: {
    where: Prisma.JobWhereUniqueInput;
    data: Partial<CreateJobDto>;
  }): Promise<Job> {
    const { where, data } = params;
    const job = await this.prisma.job.findUnique({ where });

    if (!job) {
      throw new NotFoundException(`Job not found`);
    }

    if (data.categoryIds) {
      await this.prisma.jobCategory.deleteMany({
        where: { jobId: job.id },
      });
    }

    if (data.locationIds) {
      await this.prisma.jobLocation.deleteMany({
        where: { jobId: job.id },
      });
    }

    try {
      return await this.prisma.job.update({
        where,
        data: {
          payment: data.payment,
          photos: data.photos,
          customerLink: data.customerLink,
          discount: data.discount,
          closingDate: data.closingDate,
          eventDate: data.eventDate,
          gift: data.gift,
          customer: data.customerId
            ? {
                connect: { id: data.customerId },
              }
            : undefined,
          categories: data.categoryIds
            ? {
                create: data.categoryIds.map((categoryId) => ({
                  category: {
                    connect: { id: categoryId },
                  },
                })),
              }
            : undefined,
          locations: data.locationIds
            ? {
                create: data.locationIds.map((locationId) => ({
                  location: {
                    connect: { id: locationId },
                  },
                })),
              }
            : undefined,
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
