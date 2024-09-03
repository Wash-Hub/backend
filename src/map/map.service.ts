import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Map } from './entities/map.entity';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { PageDto } from '../common/dtos/page.dto';
import { MapReview } from '../map-review/entities/map-review.entity';

@Injectable()
export class MapService {
  private readonly kakaoApiUrl =
    'https://dapi.kakao.com/v2/local/search/address.json';

  constructor(
    @InjectRepository(Map) private mapRepository: Repository<Map>,
    @InjectRepository(MapReview)
    private mapReviewRepository: Repository<MapReview>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // async cleanUpCoordiates() {
  //   const apiKey = this.configService.get<string>('KAKAO_AUTH_CLIENTID');
  //   const storeResponse = await axios.get(
  //     'http://www.cleanup24.co.kr/sub/storelist/list.asp',
  //   );
  //   const $ = cheerio.load(storeResponse.data);
  //   $('li.li2').each((index, element) => {
  //     const imgElement = $(element).find('img').first();
  //     const img = imgElement.attr('data-src'); // data-src 속성에서 이미지 URL을 추출
  //     let title = $(element).find('h4.h4').text().trim();
  //     const roadNames = $(element).find('p.p').text().trim();
  //
  //     console.log('dsda', img);
  //
  //     if (title.includes('런드리24')) {
  //       title = title.replaceAll('런드리24', '').trim();
  //     }
  //     if (img && img.startsWith('http')) {
  //       storeData.push({
  //         img,
  //         title,
  //         roadNames,
  //       });
  //     }
  //   });
  //
  //   // 데이터를 저장할 배열
  //   const storeData = [];
  // }

  async saveAllCoordinates(): Promise<Map[]> {
    const apiKey = this.configService.get<string>('KAKAO_AUTH_CLIENTID');
    console.log('api', apiKey);

    // HTML 파싱을 위한 axios 호출
    const storeResponse = await axios.get('https://laundry24.net/storestatus/');
    const $ = cheerio.load(storeResponse.data);
    console.log('sd', storeResponse);
    // 데이터를 저장할 배열
    const storeData = [];

    // li 요소를 순회하면서 data-src, title, description 추출
    $('li.li2').each((index, element) => {
      const imgElement = $(element).find('img').first();
      const img = imgElement.attr('data-src'); // data-src 속성에서 이미지 URL을 추출
      let title = $(element).find('h4.h4').text().trim();
      const roadNames = $(element).find('p.p').text().trim();

      if (title.includes('런드리24')) {
        title = title.replaceAll('런드리24', '').trim();
      }
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

    // 새로운 맵 엔트리 생성 및 저장
    for (const store of storeData) {
      const kakaoResponse = await firstValueFrom(
        this.httpService.get(this.kakaoApiUrl, {
          params: { query: store.roadNames },
          headers: { Authorization: `KakaoAK ${apiKey}` },
        }),
      );

      const kakaoData = kakaoResponse.data;
      if (kakaoData.documents && kakaoData.documents.length > 0) {
        const addressName = kakaoData.documents[0].address.address_name;
        const longitude = kakaoData.documents[0].address.x;
        const latitude = kakaoData.documents[0].address.y;

        const newMap = this.mapRepository.create({
          placeName: titleName + store.title,
          roadName: addressName,
          longitude: longitude,
          latitude: latitude,
          picture: store.img,
        });

        const savedMap = await this.mapRepository.save(newMap);
        savedMaps.push(savedMap);
      }
    }
    return savedMaps;
  }

  async mapGetById(id: string, pageOptionsDto: PageOptionsDto) {
    // 1. map 정보를 가져오기
    const map = await this.mapRepository
      .createQueryBuilder('map')
      .where('map.id = :id', { id })
      .getOne();

    if (!map) {
      throw new Error('Map not found');
    }

    // 2. mapReview 정보를 페이징하여 가져오기
    const [mapReviews, itemCount] = await this.mapReviewRepository
      .createQueryBuilder('mapReview')
      .where('mapReview.mapId = :id', { id })
      .orderBy('mapReview.createdAt', pageOptionsDto.rev9ew)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    // 3. 페이징 메타데이터 생성
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // 4. map 정보와 함께 페이징된 mapReview 정보 반환
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
}
