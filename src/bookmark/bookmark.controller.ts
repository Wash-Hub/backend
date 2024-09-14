import {
  Controller,
  Req,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from '../auth/guard/jwtAccess-auth.guard';
import { RequestWithUserInterface } from '../auth/requestWithUser.interface';

@ApiTags('Bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('create')
  @ApiBody({ type: CreateBookmarkDto })
  @ApiOperation({
    summary: '북마크표시',
  })
  @ApiOperation({
    description: 'Bookmark',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  async bookMarkMao(
    @Req() req: RequestWithUserInterface,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    const bookMark = await this.bookmarkService.createBookMark(
      req.user,
      createBookmarkDto,
    );
    return bookMark;
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: '북마크 취소',
    description: '북마크 취소 map id 입력',
  })
  async bookMarkDelete(@Param('id') mapId: string) {
    await this.bookmarkService.deleteBookMark(mapId);
  }
}
