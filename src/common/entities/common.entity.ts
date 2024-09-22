import {
  BeforeInsert,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
} from 'typeorm';

export abstract class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  // 문자열로 날짜를 저장 (YYYY-MM-DD 형식)
  @Column({ type: 'date' })
  public createdAt: string;

  @Column({ type: 'date' })
  public updatedAt: string;

  @BeforeInsert()
  setCreationDate() {
    const currentDateTime = new Date();

    // 한국 시간대 (UTC+9) 적용
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(currentDateTime.getTime() + kstOffset);

    // YYYY-MM-DD 형식으로 날짜 저장
    const dateOnly = kstDate.toISOString().split('T')[0];

    this.createdAt = dateOnly;
    this.updatedAt = dateOnly;
  }

  @BeforeUpdate()
  setUpdateDate() {
    const currentDateTime = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(currentDateTime.getTime() + kstOffset);
    const dateOnly = kstDate.toISOString().split('T')[0];

    this.updatedAt = dateOnly;
  }
}
