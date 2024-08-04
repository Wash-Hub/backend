import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('No user id');
    }
    return user;
  }

  //user생성
  async CreateUser(createUserDto: CreateUserDto) {
    const newSignup = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newSignup);
    return newSignup;
  }

  //email 찾기
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('No user Email');
    }
    return user;
  }

  //리프레시토큰 검증 함수
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) return user;
  }

  //로그아웃시 실행되는 함수
  async removeRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async deleteByUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id}
    })
    if (!user) {
      throw  new NotFoundException('No user')
    }
    await this.userRepository.delete(id)
    return 'deleted';
  }

  async getUserInfo(id: string) {
    const profile = await this.userRepository.findOne({
      where: {id}
    })
    return profile;
  }

  //update
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {id}
    })

    if(!user) {
      throw new NotFoundException('no userid')
    }

    await this.userRepository.update({id}, updateUserDto)
    return 'success'
  }
}
