import { AuthGuard } from '@nestjs/passport';
import { Provider } from '../../user/entities/provider.enum';

export class KakaoAuthGuard extends AuthGuard(Provider.KAKAO) {}
