import { Item } from 'src/items/entities/items.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
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
    type: 'boolean',
    default: true,
    nullable: true,
  })
  isActive?: boolean;

  @ManyToMany(() => Menu, (menus) => menus.categories, { onDelete: 'CASCADE' })
  @JoinTable()
  menus: Menu[];

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
