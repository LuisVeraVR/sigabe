export interface CreateLoanDto {
  userId: string;
  bookId: string;
  dueDate: Date | string;
}

export interface ReturnLoanDto {
  returnDate?: Date | string;
}

export interface LoanResponseDto {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
  };
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
  fine?: {
    id: string;
    amount: number;
    status: string;
  };
}