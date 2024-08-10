import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class MapReviewService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;
  constructor(
    @InjectRepository(MapReview)
    private mapReviewRepository: Repository<MapReview>,
    private readonly awsService: AwsService,
  ) {}

  async createReview(
    createMapReviewDto: CreateMapReviewDto,
    // user: User,
    files: Express.Multer.File[],
  ) {
    console.log('123', files);
    const uploadedImagesUrls = await Promise.all(
      files.map(async (file) => {
        const { key } = await this.awsService.uploadFileToS3('map', file);
        console.log('key', key);
        return this.awsService.getAwsS3FileUrl(key);
      }),
    );

    console.log('ㄴㅇㅁㅇ', uploadedImagesUrls);
    const newReview = await this.mapReviewRepository.create({
      // user,
      ...createMapReviewDto,
      img: uploadedImagesUrls,
    });
    await this.mapReviewRepository.save(newReview);
    return newReview;
  }
}
