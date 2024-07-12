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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @HttpCode(200)
  // @Get('kakao')
  // @UseGuards(KakaoAuthGuard)
  // async kakaoLogin(): Promise<any> {
  //   return HttpStatus.OK;
  // }
  //
  // @HttpCode(200)
  // @Get('kakao/callback')
  // @UseGuards(KakaoAuthGuard)
  // async kakaoLoginCallBack(@Req() req: any): Promise<any> {
  //   const { user } = req;
  //   const accessToken = await this.authService.generateAccessToken(user.id);
  //   const refreshToken = await this.authService.generateRefreshToken(user.id);
  //   return { user, accessToken, refreshToken };
  // }

  @HttpCode(200)
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @HttpCode(200)
  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallBack(@Req() req: any): Promise<any> {
    const { user } = req;
    console.log(user);
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    console.log('sdads', refreshToken.refreshToken);
    return { accessToken, refreshToken: refreshToken.refreshToken, user };
  }
}
