import { Module } from '@nestjs/common';
import { MapReviewService } from './map-review.service';
import { MapReviewController } from './map-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapReview } from './entities/map-review.entity';
import { AwsModule } from '../aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { Map } from '../map/entities/map.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MapReview, Map]),
    AwsModule,
    ConfigModule.forRoot(),
  ],
  controllers: [MapReviewController],
  providers: [MapReviewService],
})
export class MapReviewModule {}
