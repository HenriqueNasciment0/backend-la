import { Test, TestingModule } from '@nestjs/testing';
import { JobPhotosService } from './job-photos.service';

describe('JobPhotosService', () => {
  let service: JobPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobPhotosService],
    }).compile();

    service = module.get<JobPhotosService>(JobPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
