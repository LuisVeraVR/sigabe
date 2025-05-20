import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Loan } from "./loan";

export enum FineStatus {
  PENDING = "pending",
  PAID = "paid"
}

@Entity()
export class Fine {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Loan, loan => loan.fine, { eager: true })
  @JoinColumn()
  loan!: Loan;

  @Column()
  loanId!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({
    type: "text",
    enum: FineStatus,
    default: FineStatus.PENDING
  })
  status!: FineStatus;
}