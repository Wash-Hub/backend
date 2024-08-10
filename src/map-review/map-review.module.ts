import { Module } from '@nestjs/common';
import { MapReviewService } from './map-review.service';
import { MapReviewController } from './map-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapReview } from './entities/map-review.entity';
import { AwsModule } from '../aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([MapReview]),
    AwsModule,
    ConfigModule.forRoot(),
  ],
  controllers: [MapReviewController],
  providers: [MapReviewService],
})
export class MapReviewModule {}
