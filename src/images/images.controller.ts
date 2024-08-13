import { Controller, Post, Param, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadImagesDto } from 'src/images/dto/upload-images.dto';
import { UploadThumbnailDto } from 'src/images/dto/upload-thumbnail.dto';
import { ProductsService } from 'src/products/products.service';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private   productsService: ProductsService) { }

  @Post('thumbnail/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UploadThumbnailDto })
  @ApiResponse({ status: 200, description: 'Thumbnail uploaded and product updated.' })
 async updateThumbnail(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.productsService.updateThumbnail(id, file);
  }

  @Post('multiple/:id')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiBody({ type: UploadImagesDto })
  @ApiResponse({ status: 200, description: 'Images uploaded and product updated.' })
 async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.productsService.uploadImages(id, files);
  }



}
