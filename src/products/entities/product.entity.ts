import { Category } from 'src/categories/entities/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn( 'uuid' )
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  promoPrice: number;

  @Column({ nullable: true, default: false })
  isOnPromotion: boolean;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  seller: string;

  @Column({ nullable: true })
  thumbnailHd: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ nullable: true })
  stock: number;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  reviewsCount: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column('text', { array: true, nullable: true })
  images: string[];  

  @Column({ default: false })
  highlight: boolean;
}
