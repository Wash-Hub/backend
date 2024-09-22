import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';
import { JwtAccessAuthStrategy } from './strategies/jwtAccess-auth.strategy';
import { JwtRefreshAuthStrategy } from './strategies/jwtRefresh-auth.strategy';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({}), PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    KakaoAuthStrategy,
    JwtAccessAuthStrategy,
    JwtRefreshAuthStrategy,
  ],
})
export class AuthModule {}
