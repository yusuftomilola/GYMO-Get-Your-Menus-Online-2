import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imageUrl?: string;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  price?: number;

  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
