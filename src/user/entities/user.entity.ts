import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { Provider } from './provider.enum';
import * as gravatar from 'gravatar';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { MapReview } from '../../map-review/entities/map-review.entity';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';

@Entity()
export class User extends CommonEntity {
  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @Column({ nullable: true })
  public nickname?: string;

  @OneToMany(() => Bookmark, (bookmark: Bookmark) => bookmark.user, {
    cascade: true,
  })
  public bookmark: Bookmark[];

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToMany(() => MapReview, (mapReview: MapReview) => mapReview.user, {
    cascade: true,
  })
  public mapReview: MapReview[];

  @BeforeInsert()
  async beforeSaveFunction(): Promise<void> {
    try {
      if (this.provider !== Provider.LOCAL) {
        if (!this.nickname && this.name) {
          this.nickname = this.name;
        }
        return;
      } else {
        // const saltValue = await bcrypt.genSalt(10);

        // this.password = await bcrypt.hash(this.password, saltValue);
        this.profileImg = await gravatar.url(this.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        });
        if (this.name && !this.nickname) {
          this.nickname = this.name;
        }
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
