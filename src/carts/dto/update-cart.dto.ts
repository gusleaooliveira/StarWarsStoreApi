import { PartialType } from '@nestjs/swagger'; 
import { AddToCartDto } from './create-cart.dto';

export class UpdateCartItemDto extends PartialType(AddToCartDto) {}
