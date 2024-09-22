import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Map } from './entities/map.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MapReview } from '../map-review/entities/map-review.entity';
import { Bookmark } from '../bookmark/entities/bookmark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Map, MapReview, Bookmark]),
    HttpModule,
    ConfigModule.forRoot(),
  ],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
