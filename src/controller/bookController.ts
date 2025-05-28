import { Request, Response } from 'express';
import { Book } from '../entity/book';
import mongoose from 'mongoose';

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getBooks = async (_: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    
    const book = await Book.findById(id);
    
    if (!book) {
      res.status(404).json({ message: 'Libro no encontrado' });
      return;
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    
    const book = await Book.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      res.status(404).json({ message: 'Libro no encontrado' });
      return;
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    
    const book = await Book.findByIdAndDelete(id);
    
    if (!book) {
      res.status(404).json({ message: 'Libro no encontrado' });
      return;
    }
    
    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};