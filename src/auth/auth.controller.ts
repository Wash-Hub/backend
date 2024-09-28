import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from './guard/jwtRefresh-auth.guard';
import { RequestWithUserInterface } from './requestWithUser.interface';
import { JwtAccessAuthGuard } from './guard/jwtAccess-auth.guard';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';
import { PageOptionsDto } from '../common/dtos/page-options.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(200)
  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallBack(@Req() req: any): Promise<any> {
    const user = req.user;
    console.log(user);
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(
      refreshToken.refreshToken,
      user.id,
    );
    console.log('sdads', refreshToken.refreshToken);
    return { accessToken, refreshToken: refreshToken.refreshToken, user };
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: ' 프로필정보',
    description: '프로필정보불러오는 api',
  })
  async getUserInfo(
    @Req() req: RequestWithUserInterface,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    try {
      const { user } = req;
      console.log(user);
      const data = await this.authService.userInfo(user.id, pageOptionsDto);
      return { data };
    } catch (err) {
      throw new UnauthorizedException('No user');
    }
  }

  @Patch()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(200)
  @ApiOperation({ summary: '프로필 수정', description: '프로필 수정 api' })
  async updateUser(
    @Req() req: RequestWithUserInterface,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { user } = req;
    return await this.authService.updateUser(user.id, updateUserDto);
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Req() req: RequestWithUserInterface) {
    const accessToken = await this.authService.generateAccessToken(req.user.id);
    return accessToken;
  }

  @Delete()
  @UseGuards(JwtAccessAuthGuard)
  async deleteUser(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    await this.authService.deletedUser(user.id);
  }

  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: RequestWithUserInterface) {
    await this.userService.removeRefreshToken(req.user.id);
  }
}
