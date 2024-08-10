import { PartialType } from '@nestjs/swagger';
import { CreateMapReviewDto } from './create-map-review.dto';

export class UpdateMapReviewDto extends PartialType(CreateMapReviewDto) {}
