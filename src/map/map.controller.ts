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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../common/dtos/page-options.dto';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}
  //
  // @Post('coordinates')
  // async getCoordinates(@Query('address') address: string) {
  //   return this.mapService.getCoordinatesByAddress(address);
  // }
  @Post('coordinates')
  async saveAllCoordinates() {
    return this.mapService.saveAllCoordinates();
  }

  @Get('search')
  @ApiOperation({
    summary: '세탁소 검색기능',
    description: '검색기능',
  })
  // @ApiQuery({ name: 'search', required: false, description: '검색 유형' })
  async searchMovie(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('title') searchQuery?: string,
  ) {
    return await this.mapService.searchMap(pageOptionsDto, searchQuery);
  }

  @Get(':id')
  @ApiOperation({
    summary: '세탁소 상세페이지',
    description: '세탁소 상세페이지',
  })
  async getMapId(
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.mapService.mapGetById(id, pageOptionsDto);
  }

  // @Post('cleanup')
  // async cleanupCoorinates() {
  //   return this.mapService.cleanUpCoordiates();
  // }
}
