import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      // 토큰 만료된 경우
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Expired AccessToken'); // 만료된 토큰 예외 메시지
      }

      // 기타 인증 오류
      if (info) {
        throw new UnauthorizedException(info.message || 'Invalid Access Token'); // JWT에서 발생하는 기본 에러 메시지
      }

      // 기타 오류
      throw err || new UnauthorizedException('Unauthorized'); // 그 외 예외 처리
    }

    return user;
  }
}
