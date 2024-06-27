import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @Column('varchar')
  username: string;

  @Column('text')
  password: string;

  @CreateDateColumn({ name: 'create_date' })
  create_date: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updated_date: Date;

  @Column({ nullable: true })
  last_login?: Date;

  @Column('varchar', { nullable: true })
  hash_refresh_token: string;
}
