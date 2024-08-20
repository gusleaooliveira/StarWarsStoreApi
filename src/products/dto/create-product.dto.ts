import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  promoPrice: number;

  @ApiProperty()
  isOnPromotion: boolean;

  @ApiProperty()
  zipcode: string;

  @ApiProperty()
  seller: string;

  @ApiProperty()
  thumbnailHd: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  reviewsCount: number;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  dimensions: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  highlight: boolean;
}
