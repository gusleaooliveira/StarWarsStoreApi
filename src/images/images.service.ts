import { Injectable } from '@nestjs/common'; 
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {

  private s3Client: S3Client

  constructor(private ConfigService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.ConfigService.get('REGION'),
      credentials: {
        accessKeyId: this.ConfigService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.ConfigService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async updateThumbnail(file: Express.Multer.File) {
    const thumbnailUrl = await this.uploadImage(file)
    return thumbnailUrl
  }

  async uploadImages(files: Express.Multer.File[]) {
    const imagesUrls = await Promise.all(files.map(async (file) => {
      const imageUrl = await this.uploadImage(file)
      return imageUrl
    }))
    return imagesUrls
  }


  private async uploadImage(file: Express.Multer.File) {
    const originalname = file.originalname.split('.');
    const name = `${new Date().toISOString()}.${originalname[originalname.length - 1]}`;
    const uploadParams = {
      Bucket: this.ConfigService.get('BUCKET_NAME'),
      Key: name,
      Body: file.buffer,
      ContentType: file.mimetype,
      acl: 'public-read',
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command); 
    return `https://stars-store.s3.amazonaws.com/${name}`;
  }

 

}
