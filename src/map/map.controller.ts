import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post('coordinates')
  async getCoordinates(@Query('address') address: string) {
    return this.mapService.getCoordinatesByAddress(address);
  }
}
