import { ApiProperty } from '@nestjs/swagger';
import { Map } from '../../map/entities/map.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMapReviewDto {
  @ApiProperty({
    description: 'insert mapId',
    default: 'mapId',
  })
  map: Map;
  @ApiProperty({
    description: 'insert Descroption',
    default: 'default',
  })
  desc: string;
}
