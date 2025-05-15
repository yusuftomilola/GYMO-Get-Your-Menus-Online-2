import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  userName: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  password: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
