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
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Job } from '@prisma/client';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getAllJobs(): Promise<Job[]> {
    try {
      return await this.jobService.getJobs();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching jobs',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getJobById(@Param('id') id: string): Promise<Job> {
    try {
      const job = await this.jobService.getJobById({ id: Number(id) });
      if (!job) {
        throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
      }
      return job;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching job',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(@Body() data: CreateJobDto): Promise<Job> {
    try {
      return await this.jobService.createJob(data);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating job',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() data: Partial<CreateJobDto>,
  ): Promise<Job> {
    try {
      return await this.jobService.updateJob({
        where: { id: Number(id) },
        data,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error updating job',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
