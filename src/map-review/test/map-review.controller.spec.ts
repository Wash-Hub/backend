import { Test, TestingModule } from '@nestjs/testing';
import { MapReviewController } from '../map-review.controller';
import { MapReviewService } from '../map-review.service';

describe('MapReviewController', () => {
  let controller: MapReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapReviewController],
      providers: [MapReviewService],
    }).compile();

    controller = module.get<MapReviewController>(MapReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
