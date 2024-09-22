import { Test, TestingModule } from '@nestjs/testing';
import { MapReviewService } from '../map-review.service';

describe('MapReviewService', () => {
  let service: MapReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapReviewService],
    }).compile();

    service = module.get<MapReviewService>(MapReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
