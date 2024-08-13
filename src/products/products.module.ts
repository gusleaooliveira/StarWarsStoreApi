import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => ImagesModule)
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsModule, ProductsService],
})
export class ProductsModule { }
