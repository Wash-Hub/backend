import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewConstants } from '../constants/review.constants';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class PageOptionsDto {
  @ApiPropertyOptional({ enum: ReviewConstants, default: ReviewConstants.ASC })
  @IsEnum(ReviewConstants)
  @IsOptional()
  readonly rev9ew?: ReviewConstants = ReviewConstants.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 5;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
