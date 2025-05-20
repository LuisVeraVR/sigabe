export interface CreateLoanDto {
  userId: number;
  bookId: number;
  dueDate: Date | string;
}

export interface ReturnLoanDto {
  returnDate?: Date | string;
}

export interface LoanResponseDto {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  book: {
    id: number;
    title: string;
    author: string;
  };
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
  fine?: {
    id: number;
    amount: number;
    status: string;
  };
}