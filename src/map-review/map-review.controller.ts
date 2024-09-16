import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MapReviewService } from './map-review.service';
import { CreateMapReviewDto } from './dto/create-map-review.dto';
import { UpdateMapReviewDto } from './dto/update-map-review.dto';
import { JwtAccessAuthGuard } from '../auth/guard/jwtAccess-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUserInterface } from '../auth/requestWithUser.interface';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Map-Review')
@Controller('review')
export class MapReviewController {
  constructor(private readonly mapReviewService: MapReviewService) {}

  @Post('create')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: '리뷰남기기 사진가능',
    description: '사진, 이름',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async createReview(
    @Req() req: RequestWithUserInterface,
    @Body() createMapReviewDto: CreateMapReviewDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('sdad', files);
    const newReview = await this.mapReviewService.createReview(
      createMapReviewDto,
      req.user,
      files,
    );
    return newReview;
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '삭제', description: '리뷰삭제' })
  async deleteReview(@Param('id') id: string) {
    return await this.mapReviewService.deleteReview(id);
  }
}
