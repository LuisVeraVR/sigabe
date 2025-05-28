export interface FineResponseDto {
  id: string;
  loan: {
    id: string;
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