import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ImagesModule } from 'src/images/images.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    CategoriesModule,
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => ImagesModule)
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsModule, ProductsService],
})
export class ProductsModule { }
