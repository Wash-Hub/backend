import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err, user, info) {
    if (err || !user) {
      // 토큰 만료된 경우
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Expired RefreshToken'); // 만료된 토큰 예외 메시지
      }

      // 기타 인증 오류
      if (info) {
        throw new UnauthorizedException(
          info.message || 'Invalid Refresh Token',
        ); // JWT에서 발생하는 기본 에러 메시지
      }

      // 기타 오류
      throw err || new UnauthorizedException('Unauthorized'); // 그 외 예외 처리
    }

    return user;
  }
}
