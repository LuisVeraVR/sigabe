import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Writer } from "./writers";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column()
  nombre!: string; 
  
  @Column()
  genero!: string; 
  
  @Column("int")
  añoPublicacion!: number; 
  
  @ManyToOne(() => Writer, writer => writer.books, { nullable: false })
  @JoinColumn({ name: "authorId" })
  author!: Writer;
}