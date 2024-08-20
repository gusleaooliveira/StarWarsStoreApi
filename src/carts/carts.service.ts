import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/create-cart.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service'; 
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly connection: Connection,
  ) {}

  async addToCart(addToCartDto: AddToCartDto): Promise<Cart> {
    this.logger.log('Starting addToCart process...');

    const user = await this.usersService.findOne(addToCartDto.user);
    if (!user) {
      this.logger.error(`User with id ${addToCartDto.user} not found`);
      throw new NotFoundException(`User with id ${addToCartDto.user} not found`);
    }
    this.logger.log(`User found: ${user.id}`);

    return await this.connection.transaction(async (entityManager: EntityManager) => {
      // Verifica se o carrinho já existe dentro da transação
      let cart = await entityManager.findOne(Cart, {
        where: { user },
        relations: ['items', 'items.product'],
      });

      if (cart) {
        this.logger.log(`Existing cart found for user ${user.id}`);
      } else {
        this.logger.log(`No cart found for user ${user.id}, creating a new one`);
        cart = entityManager.create(Cart, { user, items: [] });
        cart = await entityManager.save(Cart, cart); // Salva o carrinho imediatamente
        this.logger.log(`New cart created with id ${cart.id}`);
      }

      for (const productData of addToCartDto.products) {
        this.logger.log(`Processing product ${productData.productId} with quantity ${productData.quantity}`);

        const product = await this.productsService.findOne(productData.productId);
        if (!product) {
          this.logger.error(`Product with id ${productData.productId} not found`);
          throw new NotFoundException(`Product with id ${productData.productId} not found`);
        }
        this.logger.log(`Product found: ${product.id}`);

        let cartItem = cart.items.find(item => item.product.id === product.id);

        if (cartItem) {
          this.logger.log(`Cart item exists, updating quantity. Current quantity: ${cartItem.quantity}, Adding: ${productData.quantity}`);
          cartItem.quantity += productData.quantity;
          cartItem = await entityManager.save(CartItem, cartItem);
          this.logger.log(`Updated cart item with id ${cartItem.id}, new quantity: ${cartItem.quantity}`);
        } else {
          this.logger.log(`Creating new cart item for product ${product.id}`);
          cartItem = entityManager.create(CartItem, {
            product,
            quantity: productData.quantity,
            cart,
          });
          cartItem = await entityManager.save(CartItem, cartItem);
          this.logger.log(`New cart item created with id ${cartItem.id}`);
          cart.items.push(cartItem);
        }
      }

      this.logger.log(`Saving cart with id ${cart.id}`);
      const updatedCart = await entityManager.save(Cart, cart);
      this.logger.log(`Cart saved successfully with id ${updatedCart.id}`);

      return updatedCart;
    });
  }
  
  
  
  

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }

    return cart;
  }

  async updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id }, relations: ['cart', 'product'] });
  
    if (!cartItem) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }
  
    const product = await this.productsService.findOne(updateCartItemDto.products[0].productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${updateCartItemDto.products[0].productId} not found`);
    }
  
    cartItem.product = product;
    cartItem.quantity = updateCartItemDto.products[0].quantity;
  
    await this.cartItemRepository.save(cartItem);
  
    return this.findOne(cartItem.cart.id);
  }
  


  async removeCartItem(cartItemId: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id: cartItemId }, relations: ['cart'] });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with id ${cartItemId} not found`);
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async clearCart(id: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }

    await this.cartItemRepository.remove(cart.items);
  }

  async removeCart(id: string): Promise<void> {
    const cart = await this.findOne(id);

    await this.cartRepository.remove(cart);
  }
}
