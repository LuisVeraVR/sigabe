import mongoose, { Document, Schema } from 'mongoose';
import { ILoan } from './loan';

export enum FineStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export interface IFine extends Document {
  loan: mongoose.Types.ObjectId | ILoan;
  amount: number;
  createdAt: Date;
  paidAt?: Date;
  status: FineStatus;
  _id: string;
  id: string;
}

const fineSchema = new Schema<IFine>(
  {
    loan: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: [true, 'Loan is required'],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(FineStatus),
      default: FineStatus.PENDING,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

fineSchema.virtual('id').get(function() {
  return this._id.toString();
});

export const Fine = mongoose.model<IFine>('Fine', fineSchema);