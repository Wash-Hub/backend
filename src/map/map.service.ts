import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Map } from './entities/map.entity';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class MapService {
  private readonly kakaoApiUrl =
    'https://dapi.kakao.com/v2/local/search/address.json';

  constructor(
    @InjectRepository(Map) private mapRepository: Repository<Map>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async cleanUpCoordiates() {
    const apiKey = this.configService.get<string>('KAKAO_AUTH_CLIENTID');
    const storeResponse = await axios.get(
      'http://www.cleanup24.co.kr/sub/storelist/list.asp',
    );
    const $ = cheerio.load(storeResponse.data);
    $('li.li2').each((index, element) => {
      const imgElement = $(element).find('img').first();
      const img = imgElement.attr('data-src'); // data-src 속성에서 이미지 URL을 추출
      let title = $(element).find('h4.h4').text().trim();
      const roadNames = $(element).find('p.p').text().trim();

      console.log('dsda', img);

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

    // 데이터를 저장할 배열
    const storeData = [];
  }

  async saveAllCoordinates(): Promise<Map[]> {
    const apiKey = this.configService.get<string>('KAKAO_AUTH_CLIENTID');
    console.log('api', apiKey);

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
}
