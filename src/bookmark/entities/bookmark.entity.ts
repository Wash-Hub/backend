import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { User } from '../../user/entities/user.entity';
import { Map } from '../../map/entities/map.entity';

@Entity()
export class Bookmark extends CommonEntity {
  @ManyToOne(() => User, (user: User) => user.bookmark, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Map, (map: Map) => map.bookmark, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public map?: Map;

  @Column({ default: false })
  public isBookMark: boolean;
}
