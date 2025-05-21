import { Request, Response, NextFunction } from "express";
import { BookService } from "../services/book.service";

const bookService = new BookService();

export const createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { 
    const book = await bookService.createBook(req.body); 
    res.status(201).json(book); 
  }
  catch (err) { 
    next(err); 
  }
};

export const getBooks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { 
    const books = await bookService.getAllBooks(); 
    res.json(books); 
  }
  catch (err) { 
    next(err); 
  }
};

export const updateBookAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { 
    const updated = await bookService.updateBookAuthor(+req.params.id, req.body.writerId); 
    res.json(updated); 
  }
  catch (err) { 
    next(err); 
  }
};