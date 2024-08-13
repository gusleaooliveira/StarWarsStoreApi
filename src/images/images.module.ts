import { forwardRef, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesModule, ImagesService],
})
export class ImagesModule {}
