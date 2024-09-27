import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from './tokenPayload.interface';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //토큰 생성함수
  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESSTOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get('ACCESSTOKEN_EXPIRATION_TIME')}m`,
    });
    return accessToken;
  }

  public generateRefreshToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESHTOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get('REFRESHTOKEN_EXPIRATION_TIME')}m`,
    });
    //
    // const cookie = `Refresh=${refreshToken}; HttpOnly; Secure; path=/; Max-Age=${this.configService.get(
    //   'REFRESHTOKEN_EXPIRATION_TIME',
    // )}; SameSite=None; Domain=.dukpool.co.kr`;
    // // const cookie = `Refresh=${refreshToken}; HttpOnly; SameSite=None; path=/; Max-Age=${this.configService.get(
    // //   'REFRESHTOKEN_EXPIRATION_TIME',
    // // )}; Domain=localhost`;

    return { refreshToken };
  }

  async userInfo(id: string, pageOptionsDto: PageOptionsDto) {
    const userInfo = await this.userService.getUserInfo(id, pageOptionsDto);
    return userInfo;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, updateUserDto);
    return user;
  }

  async deletedUser(id: string) {
    const user = await this.userService.deleteByUser(id);
    return user;
  }
}
