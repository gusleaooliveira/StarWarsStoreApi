import { Controller, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './carts.service';
import { AddToCartDto } from './dto/create-cart.dto'; 
import { UpdateCartItemDto } from './dto/update-cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add multiple items to the cart' })
  @ApiResponse({ status: 201, description: 'The items have been successfully added to the cart.' })
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return await this.cartService.addToCart(addToCartDto);
  }

  @Patch(':id/item')
  @ApiOperation({ summary: 'Update a specific cart item' })
  @ApiResponse({ status: 200, description: 'The cart item has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  async updateCartItem(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return await this.cartService.updateCartItem(id, updateCartItemDto);
  }

  @Delete(':id/item/:itemId')
  @ApiOperation({ summary: 'Remove a specific item from the cart' })
  @ApiResponse({ status: 200, description: 'The cart item has been successfully removed.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  async removeCartItem(@Param('itemId') itemId: string) {
    await this.cartService.removeCartItem(itemId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Clear all items from the cart' })
  @ApiResponse({ status: 200, description: 'The cart has been successfully cleared.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async clearCart(@Param('id') id: string) {
    await this.cartService.clearCart(id);
  }

  @Delete('remove/:id')
  @ApiOperation({ summary: 'Remove the entire cart' })
  @ApiResponse({ status: 200, description: 'The cart has been successfully removed.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async removeCart(@Param('id') id: string) {
    await this.cartService.removeCart(id);
  }
}
