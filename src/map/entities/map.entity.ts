import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { MapReview } from '../../map-review/entities/map-review.entity';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';

@Entity()
export class Map extends CommonEntity {
  @Column() //이름
  public placeName: string;

  @Column() //도로명
  public roadName: string;

  @Column() //사진
  public picture?: string;

  @Column({ type: 'double precision' }) // 경도 (x)
  public longitude: number;

  @Column({ type: 'double precision' }) // 위도 (y)
  public latitude: number;
  @OneToMany(() => MapReview, (mapReview: MapReview) => mapReview.map, {
    cascade: true,
  })
  public mapReview: MapReview[];

  @OneToMany(() => Bookmark, (bookmark: Bookmark) => bookmark.map, {
    cascade: true,
  })
  public bookmark: Bookmark[];

  @Column({ default: false })
  public isBookMark: boolean;

  @Column({ default: 0 }) // 리뷰 개수
  public reviewCount: number;
}
