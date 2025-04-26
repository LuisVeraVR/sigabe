// src/controllers/bookController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/book";

const bookRepository = AppDataSource.getRepository(Book);

export const createBook = async (req: Request, res: Response) => {
  const book = bookRepository.create(req.body);
  await bookRepository.save(book);
  res.status(201).json(book);
};

export const getBooks = async (_: Request, res: Response) => {
  const books = await bookRepository.find();
  res.json(books);
};

export const updateBook = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).send("Invalid ID");
      return;
    }
  
    const book = await bookRepository.findOneBy({ id });
    if (!book) {
      res.status(404).send("Book not found");
      return;
    }
  
    bookRepository.merge(book, req.body);
    const result = await bookRepository.save(book);
    res.json(result);
  };

export const deleteBook = async (req: Request, res: Response) => {
  const result = await bookRepository.delete(req.params.id);
  res.json(result);
};
