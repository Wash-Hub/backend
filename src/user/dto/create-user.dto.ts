import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Provider } from '../entities/provider.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'name',
    default: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'wash@gmail.com',
    default: 'a1234567!',
  })
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  provider?: Provider;

  @ApiProperty({
    description: 'profile img URL',
    example: null,
    nullable: true,
  })
  @IsOptional()
  profileImg?: string;
}
