import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';
import { IBook } from './book';

export enum LoanStatus {
  ACTIVE = 'active',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

export interface ILoan extends Document {
  user: mongoose.Types.ObjectId | IUser;
  book: mongoose.Types.ObjectId | IBook;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: LoanStatus;
  _id: string;
  id: string;
}

const loanSchema = new Schema<ILoan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book is required'],
    },
    loanDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

loanSchema.virtual('id').get(function() {
  return this._id.toString();
});

export const Loan = mongoose.model<ILoan>('Loan', loanSchema);