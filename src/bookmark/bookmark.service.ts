import { Injectable } from '@nestjs/common';
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
    return newBookMark;
  }
}
