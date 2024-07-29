import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class Map extends CommonEntity {
  @Column() //이름
  public placeName: string;

  @Column() //도로명
  public roadName: string;

  @Column() //사진
  public picture?: string;

  @Column() // 경도 (x)
  public longitude: string;

  @Column() //위도(y)
  public latitude: string;
}

// address_name: '서울 양천구 신정동 1317',
// b_code: '1147010100',
// h_code: '1147064000',
// main_address_no: '1317',
// mountain_yn: 'N',
// region_1depth_name: '서울',
// region_2depth_name: '양천구',
// region_3depth_h_name: '신정3동',
// region_3depth_name: '신정동',
// sub_address_no: '',
// x: '126.83110409084',
// y: '37.5108510316658'
