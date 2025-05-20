export interface FineResponseDto {
  id: number;
  loan: {
    id: number;
    bookTitle: string;
    userName: string;
    loanDate: Date;
    dueDate: Date;
    returnDate?: Date;
  };
  amount: number;
  createdAt: Date;
  paidAt?: Date;
  status: string;
}

export interface PayFineDto {
  paidAt?: Date | string;
}