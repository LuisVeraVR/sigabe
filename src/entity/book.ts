import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  year: number;
  publisher: string;
  type: string;
  photo?: string;
  available: boolean;
  _id: string;
  id: string;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    publisher: {
      type: String,
      required: [true, 'Publisher is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bookSchema.virtual('id').get(function() {
  return this._id.toString();
});

export const Book = mongoose.model<IBook>('Book', bookSchema);