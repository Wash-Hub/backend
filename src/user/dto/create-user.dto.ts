import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Provider } from '../entities/provider.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  provider?: Provider;

  @IsOptional()
  profileImg?: string;
}
