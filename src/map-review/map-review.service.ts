import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMapReviewDto } from './dto/create-map-review.dto';
import { UpdateMapReviewDto } from './dto/update-map-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MapReview } from './entities/map-review.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AWSService } from 'aws-sdk/clients/auditmanager';
import { AwsService } from '../aws/aws.service';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Map } from '../map/entities/map.entity';

@Injectable()
export class MapReviewService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;
  constructor(
    @InjectRepository(MapReview)
    private mapReviewRepository: Repository<MapReview>,
    @InjectRepository(Map)
    private mapRepository: Repository<Map>,
    private readonly awsService: AwsService,
  ) {}

  folderName = 'map';

  async createReview(
    createMapReviewDto: CreateMapReviewDto,
    user: User,
    files: Express.Multer.File[],
  ) {
    const uploadedImagesUrls = await Promise.all(
      files.map(async (file) => {
        const { key } = await this.awsService.uploadFileToS3(
          this.folderName,
          file,
        );
        return this.awsService.getAwsS3FileUrl(key);
      }),
    );
    const newReview = await this.mapReviewRepository.create({
      user,
      ...createMapReviewDto,
      img: uploadedImagesUrls,
    });

    const mapId = createMapReviewDto.map;
    await this.mapReviewRepository.save(newReview);

    await this.mapRepository
      .createQueryBuilder()
      .update(Map)
      .set({ reviewCount: () => '"reviewCount" + 1' }) // 따옴표 문제 수정
      .where('id = :mapId', { mapId })
      .execute();

    return newReview;
  }

  async deleteReview(id: string) {
    const review = await this.mapReviewRepository.findOne({
      where: { id },
      relations: ['map'], // map 관계를 로드
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }
    await Promise.all(
      review.img.map(async (imageUrl) => {
        const key = await this.awsService.extractS3KeyFromUrl(
          imageUrl,
          this.folderName,
        );
        console.log('key', key);
        await this.awsService.deleteS3Object(key);
      }),
    );

    const mapId = review.map.id;
    console.log(mapId);

    await this.mapRepository
      .createQueryBuilder()
      .update(Map)
      .set({ reviewCount: () => '"reviewCount" - 1' })
      .where('id =:mapId', { mapId })
      .execute();

    await this.mapReviewRepository.delete(id);
    return 'deleted';
  }
}
