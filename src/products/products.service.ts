import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesService } from 'src/images/images.service';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
 
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly imagesService: ImagesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const productCreated = this.productRepository.create(createProductDto);
    return await this.productRepository.save(productCreated);
  }

  async search(query: any): Promise<Product[]> {
    const where: any = {};

    if (query.title) {
      where.title = ILike(`%${query.title}%`);
    }
    if (query.category) {
      where.category = ILike(`%${query.category}%`);
    }
    if (query.minPrice) {
      where.price = { ...where.price, $gte: query.minPrice };
    }
    if (query.maxPrice) {
      where.price = { ...where.price, $lte: query.maxPrice };
    }
    if (query.seller) {
      where.seller = ILike(`%${query.seller}%`);
    } 

    return await this.productRepository.find({ where });
  }

  async findPromotions(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isOnPromotion: true },
    });
  }
  
  async findAll() {
    return  await this.productRepository.find();
  }

  async findHighlighted(): Promise<Product[]> {
    return this.productRepository.find({ where: { highlight: true } });
  }
  
  async findOne(id: string) {
    return  await this.productRepository.findOneBy({ id });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.delete(id);
    return { deleted: true, product }
  }


  async updateThumbnail(id: string, file: Express.Multer.File) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const thumbnailHd = await this.imagesService.updateThumbnail(file);
    return await this.update(id, { thumbnailHd });
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const images = await this.imagesService.uploadImages(files);
    return await this.update(id, { images })
  }
}
