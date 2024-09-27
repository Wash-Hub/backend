import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { TokenPayloadInterface } from '../tokenPayload.interface';

@Injectable()
export class JwtRefreshAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('REFRESHTOKEN_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayloadInterface) {
    const refreshToken = req;

    const authHeader = refreshToken.headers['authorization'];
    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);

    const isValid = await this.usersService.getUserIfRefreshTokenMatches(
      token,
      payload.userId,
    );
    return this.usersService.getUserById(payload.userId);
  }
}
