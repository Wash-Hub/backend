import { Injectable } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Map } from './entities/map.entity';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MapService {
  private readonly kakaoApiUrl =
    'https://dapi.kakao.com/v2/local/search/address.json';

  constructor(
    @InjectRepository(Map) private mapRepository: Repository<Map>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getCoordinatesByAddress(address: string): Promise<any> {
    const apiKey = this.configService.get<string>('KAKAO_AUTH_CLIENTID');
    console.log('api', apiKey);
    const response = await firstValueFrom(
      this.httpService.get(this.kakaoApiUrl, {
        params: { query: address },
        headers: { Authorization: `KakaoAK ${apiKey}` },
      }),
    );

    const data = response.data;
    data.documents[0].address;

    console.log('address_name:', data.documents[0].address);
    // const map = await this.mapRepository.findOneBy({
    //   where:
    // })
    const newMap = await this.mapRepository.create({
      placeName: address,
      roadName: data.documents[0].address.address_name,
      longitude: data.documents[0].address.x,
      latitude: data.documents[0].address.y,
    });

    await this.mapRepository.save(newMap);

    return newMap;

    // if (data.documents && data.documents.length > 0) {
    //   const { x, y } = data.documents[0].address;
    //   // return { longitude: x, latitude: y };
    // }
    // throw new Error('No coordinates found for the given address');
  }
}
