import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Book } from "./book";
import { Fine } from "./fine";

export enum LoanStatus {
  ACTIVE = "active",
  RETURNED = "returned",
  OVERDUE = "overdue"
}

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Book, { eager: true })
  @JoinColumn()
  book!: Book;

  @Column()
  bookId!: number;

  @CreateDateColumn()
  loanDate!: Date;

  @Column()
  dueDate!: Date;

  @Column({ nullable: true })
  returnDate?: Date;

  @Column({
    type: "text",
    enum: LoanStatus,
    default: LoanStatus.ACTIVE
  })
  status!: LoanStatus;

  @OneToOne(() => Fine, fine => fine.loan, { nullable: true })
  fine?: Fine;
}