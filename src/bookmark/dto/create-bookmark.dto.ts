import { ApiProperty } from '@nestjs/swagger';
import { Map } from '../../map/entities/map.entity';
export class CreateBookmarkDto {
  @ApiProperty({
    description: 'insert MapId',
    default: 'MapId',
  })
  map?: Map;
}
