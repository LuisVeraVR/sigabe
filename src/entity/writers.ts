
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "./book";

@Entity("writers")
export class Writer {
  @PrimaryGeneratedColumn()
  id!: number; 
  
  @Column()
  nombre!: string; 
  
  @Column()
  apellido!: string;
  
  @Column()
  nacionalidad!: string; 
  
  @Column("int")
  edad!: number; 
  
  @OneToMany(() => Book, book => book.author, { cascade: true })
  books!: Book[]; 
}