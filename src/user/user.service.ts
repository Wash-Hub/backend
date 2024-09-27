import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { PageDto } from '../common/dtos/page.dto';
import { Bookmark } from '../bookmark/entities/bookmark.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
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

  async deleteByUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('No user');
    }
    await this.userRepository.delete(id);
    return 'deleted';
  }
  async getUserInfo(id: string, pageOptionsDto: PageOptionsDto) {
    // 1. 프로필 정보 가져오기 (mapReview만 relations에 포함)
    const profile = await this.userRepository.findOne({
      where: { id },
      relations: ['mapReview.map'], // 북마크는 따로 페이지네이션하므로 제외
    });

    if (!profile) {
      throw new Error('User not found');
    }

    // 2. 북마크 정보를 페이지네이션하여 가져오기 (userRepository가 아닌 bookmarkRepository 사용)
    const [bookmarks, bookmarkCount] = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.map', 'map')
      .where('bookmark.userId = :userId', { userId: id }) // 유저 ID로 필터링
      .orderBy('bookmark.createdAt', pageOptionsDto.rev9ew || 'DESC') // 정렬 방식
      .skip(pageOptionsDto.skip) // 몇 개의 데이터를 건너뛸지
      .take(pageOptionsDto.take) // 가져올 데이터의 개수
      .getManyAndCount();

    // 3. 페이징 메타데이터 생성
    const bookmarkPageMetaDto = new PageMetaDto({
      itemCount: bookmarkCount,
      pageOptionsDto,
    });

    // 4. 페이지네이션된 북마크와 유저 프로필 정보 반환
    return {
      profile,
      bookmarks: new PageDto(bookmarks, bookmarkPageMetaDto),
    };
  }

  //update
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('no userid');
    }

    await this.userRepository.update({ id }, updateUserDto);
    return 'success';
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const saltValue = await bcrypt.genSalt(10);
    const currentHashedRefreshToken = await bcrypt.hash(
      refreshToken,
      saltValue,
    );
    console.log(currentHashedRefreshToken);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }
  async removeRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
