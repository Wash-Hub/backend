import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as puppeteer from 'puppeteer';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Map } from './entities/map.entity';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { PageDto } from '../common/dtos/page.dto';
import { MapReview } from '../map-review/entities/map-review.entity';
import { Bookmark } from '../bookmark/entities/bookmark.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MapService {
  private readonly kakaoApiUrl =
    'https://dapi.kakao.com/v2/local/search/address.json';

  constructor(
    @InjectRepository(Map) private mapRepository: Repository<Map>,
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(MapReview)
    private mapReviewRepository: Repository<MapReview>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  // async saveAllCoordinates(): Promise<Map[]> {
  //   const apiKey = this.configService.get<string>('KAKAO_AUTH_CLIENTID');
  //
  //   // HTML 파싱을 위한 axios 호출
  //   const storeResponse = await axios.get('https://laundry24.net/storestatus/');
  //   const $ = cheerio.load(storeResponse.data);
  //   // 데이터를 저장할 배열
  //   const storeData = [];
  //
  //   // li 요소를 순회하면서 data-src, title, description 추출
  //   $('li.li2').each((index, element) => {
  //     const imgElement = $(element).find('img').first();
  //     const img = imgElement.attr('data-src'); // data-src 속성에서 이미지 URL을 추출
  //     let title = $(element).find('h4.h4').text().trim();
  //     const roadNames = $(element).find('p.p').text().trim();
  //
  //     // "런드리24"라는 문자열을 제거
  //     if (title.includes('런드리24')) {
  //       title = title.replaceAll('런드리24', '').trim();
  //     }
  //
  //     // 유효한 이미지 URL과 데이터를 가진 경우만 배열에 저장
  //     if (img && img.startsWith('http')) {
  //       storeData.push({
  //         img,
  //         title,
  //         roadNames,
  //       });
  //     }
  //   });
  //
  //   // 저장된 Map 객체를 저장할 배열
  //   const savedMaps: Map[] = [];
  //   const titleName = '런드리24 ';
  //
  //   // 카카오 API를 통해 좌표 정보를 가져오고, Map 엔티티로 변환하여 저장
  //   for (const store of storeData) {
  //     const kakaoResponse = await firstValueFrom(
  //       this.httpService.get(this.kakaoApiUrl, {
  //         params: { query: store.roadNames },
  //         headers: { Authorization: `KakaoAK ${apiKey}` },
  //       }),
  //     );
  //
  //     const kakaoData = kakaoResponse.data;
  //
  //     // 좌표 정보가 존재하는 경우에만 처리
  //     if (kakaoData.documents && kakaoData.documents.length > 0) {
  //       const addressName = kakaoData.documents[0].address.address_name;
  //       const longitude = parseFloat(kakaoData.documents[0].address.x); // string을 number로 변환
  //       const latitude = parseFloat(kakaoData.documents[0].address.y); // string을 number로 변환
  //
  //       // 새로운 Map 엔티티 생성
  //       const newMap = this.mapRepository.create({
  //         placeName: titleName + store.title,
  //         roadName: addressName,
  //         longitude: longitude, // 숫자 타입으로 저장
  //         latitude: latitude, // 숫자 타입으로 저장
  //         picture: store.img,
  //       });
  //
  //       // 엔티티 저장
  //       const savedMap = await this.mapRepository.save(newMap);
  //       savedMaps.push(savedMap);
  //     }
  //   }
  //   console.log('2313', savedMaps);
  //   return savedMaps;
  // }

  async Coordinates(): Promise<Map[]> {
    const apiKey = this.configService.get<string>('KAKAO_AUTH_CLIENTID');

    // HTML 파싱을 위한 axios 호출
    const storeResponse = await axios.get('https://laundry24.net/storestatus/');
    const $ = cheerio.load(storeResponse.data);

    // 데이터를 저장할 배열
    const storeData = [];

    // li 요소를 순회하면서 data-src, title, description 추출
    $('li.li2').each((index, element) => {
      const imgElement = $(element).find('img').first();
      const img = imgElement.attr('data-src'); // data-src 속성에서 이미지 URL을 추출
      let title = $(element).find('h4.h4').text().trim();
      const roadNames = $(element).find('p.p').text().trim();

      // "런드리24"라는 문자열을 제거
      if (title.includes('런드리24')) {
        title = title.replaceAll('런드리24', '').trim();
      }

      // 유효한 이미지 URL과 데이터를 가진 경우만 배열에 저장
      if (img && img.startsWith('http')) {
        storeData.push({
          img,
          title,
          roadNames,
        });
      }
    });

    // 저장된 Map 객체를 저장할 배열
    const savedMaps: Map[] = [];
    const titleName = '런드리24 ';

    // 카카오 API를 통해 좌표 정보를 가져오고, Map 엔티티로 변환하여 저장
    for (const store of storeData) {
      const kakaoResponse = await firstValueFrom(
        this.httpService.get(this.kakaoApiUrl, {
          params: { query: store.roadNames },
          headers: { Authorization: `KakaoAK ${apiKey}` },
        }),
      );

      const kakaoData = kakaoResponse.data;

      // 좌표 정보가 존재하는 경우에만 처리
      if (kakaoData.documents && kakaoData.documents.length > 0) {
        const addressName = kakaoData.documents[0].address.address_name;
        const longitude = parseFloat(kakaoData.documents[0].address.x); // string을 number로 변환
        const latitude = parseFloat(kakaoData.documents[0].address.y); // string을 number로 변환

        // placeName이 이미 존재하는지 확인
        const existingMap = await this.mapRepository.findOne({
          where: { placeName: titleName + store.title },
        });

        // 존재하지 않는 경우에만 새로운 Map 엔티티 생성 및 저장
        if (!existingMap) {
          const newMap = this.mapRepository.create({
            placeName: titleName + store.title,
            roadName: addressName,
            longitude: longitude, // 숫자 타입으로 저장
            latitude: latitude, // 숫자 타입으로 저장
            picture: store.img,
          });

          // 엔티티 저장
          const savedMap = await this.mapRepository.save(newMap);
          savedMaps.push(savedMap);
        }
      }
    }

    console.log('2313', savedMaps);
    return savedMaps;
  }

  async mapGetById(
    id: string,
    pageOptionsDto: PageOptionsDto,
    user?: { id: string },
  ) {
    // 1. map 정보를 가져오기
    const map = await this.mapRepository
      .createQueryBuilder('map')
      .where('map.id = :id', { id })
      .getOne();

    if (!map) {
      throw new Error('Map not found');
    }

    // 2. 사용자가 있으면 북마크 여부 확인
    if (user) {
      const bookmark = await this.bookmarkRepository.findOne({
        where: { map: { id }, user: { id: user.id } },
      });

      map.isBookMark = !!bookmark; // 북마크가 있으면 true, 없으면 false
    }

    // 3. mapReview 정보를 페이징하여 가져오기
    const [mapReviews, itemCount] = await this.mapReviewRepository
      .createQueryBuilder('mapReview')
      .leftJoinAndSelect('mapReview.user', 'user')
      .where('mapReview.mapId = :id', { id })
      .orderBy('mapReview.createdAt', pageOptionsDto.rev9ew)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    // 4. 페이징 메타데이터 생성
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // 5. map 정보와 함께 페이징된 mapReview 정보 반환
    return {
      map,
      reviews: new PageDto(mapReviews, pageMetaDto),
    };
  }

  async searchMap(
    pageOptionsDto: PageOptionsDto,
    searchQuery?: string,
  ): Promise<PageDto<Map>> {
    if (searchQuery) {
      const queryBuilder = await this.mapRepository.createQueryBuilder('map');
      queryBuilder.leftJoinAndSelect('map.mapReview', 'mapReview');
      queryBuilder.where('map.placeName LIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
      await queryBuilder
        .orderBy('map.createdAt', pageOptionsDto.rev9ew)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take);
      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(entities, pageMetaDto);
    } else {
      throw new BadRequestException('검색어를 입력해야 합니다.');
    }
  }

  async getMap(x?: string, y?: string, user?: { id: string }) {
    const longitude = parseFloat(x);
    const latitude = parseFloat(y);

    // 0.5 범위 내의 데이터를 검색 (숫자 그대로 사용)
    const maps = await this.mapRepository.find({
      where: {
        longitude: Between(longitude - 0.1, longitude + 0.1),
        latitude: Between(latitude - 0.1, latitude + 0.1),
      },
    });

    // 사용자가 있으면 북마크 정보를 조회하여 isBookMark 설정
    if (user) {
      const bookmarks = await this.bookmarkRepository.find({
        where: { user: { id: user.id } },
        relations: ['map'], // 북마크한 지도의 정보를 함께 가져옴
      });

      const bookmarkedMapIds = bookmarks.map((bookmark) => bookmark.map.id);

      // 가져온 지도 리스트에서 북마크 여부를 설정
      maps.forEach((map) => {
        map.isBookMark = bookmarkedMapIds.includes(map.id);
      });
    }

    return maps;
  }

  @Cron('0 0 0 1 * *')
  handleCron() {
    console.log('$$$$$$');
    this.Coordinates();
  }
}
