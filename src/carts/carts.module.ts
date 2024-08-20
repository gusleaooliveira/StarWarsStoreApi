import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { CartController } from './carts.controller';
import { CartService } from './carts.service';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductsModule, UsersModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartsModule {}
