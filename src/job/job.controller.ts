import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Job } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllJobs(): Promise<Job[]> {
    try {
      return await this.jobService.getJobs();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching jobs',
          details: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getJobById(@Param('id') jobId: string): Promise<Job> {
    try {
      const job = await this.jobService.getJobById({ id: Number(jobId) });

      if (!job) {
        throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
      }

      return job;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Error fetching job',
          details: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('photos', 10))
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @UploadedFiles() photos?: Express.Multer.File[],
  ): Promise<Job> {
    try {
      return await this.jobService.createJob(createJobDto, photos);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create job',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('photos', 10))
  async updateJob(
    @Param('id') id: string,
    @Body() data: Partial<CreateJobDto>,
    @UploadedFiles() photos?: Express.Multer.File[],
  ): Promise<Job> {
    return this.jobService.updateJob(
      { where: { id: Number(id) }, data },
      photos,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: string): Promise<Job> {
    try {
      return await this.jobService.deleteJob({ id: Number(id) });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting job',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
