import {
  Controller,
  Get,
  Post,
  Req,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { JwtOptionalAuthGuard } from '../auth/guard/jwtOptional-auth.guard';
import { RequestWithUserInterface } from '../auth/requestWithUser.interface';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}
  @Post('coordinates')
  async saveAllCoordinates() {
    return this.mapService.saveAllCoordinates();
  }

  @Get('search')
  @ApiOperation({
    summary: '세탁소 검색기능',
    description: '검색기능',
  })
  @UseGuards(JwtOptionalAuthGuard)
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
  @UseGuards(JwtOptionalAuthGuard)
  async getMapId(
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: RequestWithUserInterface,
  ) {
    const user = req.user;
    return await this.mapService.mapGetById(id, pageOptionsDto, user);
  }

  @Get()
  @ApiOperation({
    summary: '세탁소 실시간 지도 불러오기',
    description:
      '실시간으로 쿼리를 받아서 일정거리에따라 세탁소를 보여주는 api',
  })
  @UseGuards(JwtOptionalAuthGuard)
  async GetMap(
    @Query('x') x?: string,
    @Query('y') y?: string,
    @Req() req?: RequestWithUserInterface,
  ) {
    const user = req.user;
    const map = await this.mapService.getMap(x, y, user);
    return map;
  }

  // @Post('cleanup')
  // async cleanupCoorinates() {
  //   return this.mapService.cleanUpCoordiates();
  // }
}
