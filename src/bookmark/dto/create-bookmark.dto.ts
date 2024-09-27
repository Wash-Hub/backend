import { ApiProperty } from '@nestjs/swagger';
import { Map } from '../../map/entities/map.entity';
import { IsNotEmpty } from 'class-validator';
export class CreateBookmarkDto {
  @ApiProperty({
    description: 'insert MapId',
    default: 'MapId',
  })
  @IsNotEmpty()
  map: Map;
}
