import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';

import { User } from '../../user/entities/user.entity';
import { Map } from '../../map/entities/map.entity';

@Entity()
export class MapReview extends CommonEntity {
  @ManyToOne(() => Map, (map: Map) => map.mapReview, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public map: Map;

  @Column({ nullable: true }) //글
  public desc: string;

  @Column('text', {
    //text형태로 넣어줘야함 ex) number, object등있다.
    array: true,
    nullable: true,
  })
  public img?: string[];

  @Column({ default: 0 })
  public views: number;

  @ManyToOne(() => User, (user: User) => user.mapReview, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;
}
