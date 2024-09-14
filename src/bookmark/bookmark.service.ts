import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async createBookMark(user: User, createBookmarkDto: CreateBookmarkDto) {
    const newBookMark = this.bookmarkRepository.create({
      user,
      ...createBookmarkDto,
    });
    const bookMark = await this.bookmarkRepository.findOne({
      where: { id: newBookMark.id },
    });
    if (bookMark) {
      throw new ConflictException('bookmark already');
    }
    await this.bookmarkRepository.save(newBookMark);
    return newBookMark;
  }

  async deleteBookMark(id: string) {
    try {
      const bookMark = await this.bookmarkRepository.findOne({
        where: { map: { id } },
      });
      if (!bookMark) {
        throw new NotFoundException('bookmark not found');
      }
      await this.bookmarkRepository.delete(bookMark.id);

      return 'bookmark cancel';
    } catch (err) {
      throw new BadRequestException('Failed to delete');
    }
  }
}
