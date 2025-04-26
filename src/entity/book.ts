import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import 'reflect-metadata';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    title!: string;

  @Column()
    author!: string;

  @Column()
    year!: number;

  @Column()
    publisher!: string;

  @Column()
    type!: string;

  @Column({ nullable: true }) // Fixed typo here
    photo?: string;

  @Column({ default: true })
    avaliable!: boolean;
};
