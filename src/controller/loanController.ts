import { Request, Response } from 'express';
import { Loan, LoanStatus } from '../entity/loan';
import { Book } from '../entity/book';
import { User } from '../entity/user';
import { Fine, FineStatus } from '../entity/fine';
import { CreateLoanDto, ReturnLoanDto } from '../interfaces/loan.interface';
import mongoose from 'mongoose';

const GRACE_PERIOD_DAYS = 0;
const DAILY_FINE_RATE = 5.00;

export class LoanController {
  
  static async createLoan(req: Request, res: Response): Promise<void> {
    try {
      const { userId, bookId, dueDate }: CreateLoanDto = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return;
      }
      
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({ message: 'ID de libro inválido' });
        return;
      }
      
      const book = await Book.findById(bookId);
      if (!book) {
        res.status(404).json({ message: 'Libro no encontrado' });
        return;
      }
      
      if (!book.available) {
        res.status(400).json({ message: 'El libro no está disponible actualmente' });
        return;
      }
      
      const loan = new Loan({
        user: userId,
        book: bookId,
        dueDate: new Date(dueDate),
        status: LoanStatus.ACTIVE
      });
      
      book.available = false;
      await book.save();
      
      await loan.save();
      
      res.status(201).json({
        message: 'Préstamo creado exitosamente',
        loan
      });
      
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async getLoans(req: Request, res: Response): Promise<void> {
    try {
      const loans = await Loan.find()
        .populate('user', 'firstName lastName email')
        .populate('book', 'title author')
        .exec();
      
      res.json(loans);
    } catch (error) {
      console.error('Error al obtener préstamos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async getLoansByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return;
      }
      
      const loans = await Loan.find({ user: userId })
        .populate('user', 'firstName lastName email')
        .populate('book', 'title author')
        .exec();
      
      res.json(loans);
    } catch (error) {
      console.error('Error al obtener préstamos del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async getLoanById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID inválido' });
        return;
      }
      
      const loan = await Loan.findById(id)
        .populate('user', 'firstName lastName email')
        .populate('book', 'title author')
        .exec();
      
      if (!loan) {
        res.status(404).json({ message: 'Préstamo no encontrado' });
        return;
      }
      
      const fine = await Fine.findOne({ loan: id });
      
      const loanWithFine = {
        ...loan.toObject(),
        fine: fine ? {
          id: fine._id,
          amount: fine.amount,
          status: fine.status
        } : undefined
      };
      
      res.json(loanWithFine);
    } catch (error) {
      console.error('Error al obtener préstamo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
 static async returnBook(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID inválido' });
        return;
      }
      
      const loan = await Loan.findById(id).populate('book');
      
      if (!loan) {
        res.status(404).json({ message: 'Préstamo no encontrado' });
        return;
      }
      
      if (loan.status === LoanStatus.RETURNED) {
        res.status(400).json({ message: 'Este libro ya ha sido devuelto' });
        return;
      }
      
      const { returnDate }: ReturnLoanDto = req.body;
      const actualReturnDate = returnDate ? new Date(returnDate) : new Date();
      loan.returnDate = actualReturnDate;
      
      const dueDate = new Date(loan.dueDate);
      dueDate.setDate(dueDate.getDate() + GRACE_PERIOD_DAYS);
      
      let fine;
      
      // Check if book is returned late
      if (actualReturnDate > dueDate) {
        const timeDiff = actualReturnDate.getTime() - dueDate.getTime();
        const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        const fineAmount = daysLate * DAILY_FINE_RATE;
        
        fine = new Fine({
          loan: loan._id,
          amount: fineAmount,
          status: FineStatus.PENDING
        });
        
        await fine.save();
        
        loan.status = LoanStatus.OVERDUE;
      } else {
        loan.status = LoanStatus.RETURNED;
      }
      
      // Update book availability
      if (loan.book) {
        const bookId = (loan.book as any)._id;
        if (mongoose.Types.ObjectId.isValid(bookId)) {
          await Book.findByIdAndUpdate(bookId, { available: true });
        }
      }
      
      await loan.save();
      
      const updatedLoan = await Loan.findById(id)
        .populate('user', 'firstName lastName email')
        .populate('book', 'title author')
        .exec();
        
      const updatedFine = await Fine.findOne({ loan: id });
      
      const loanResponse = {
        ...updatedLoan?.toObject(),
        fine: updatedFine ? {
          id: updatedFine._id,
          amount: updatedFine.amount,
          status: updatedFine.status
        } : undefined
      };
      
      res.json({
        message: 'Libro devuelto exitosamente',
        loan: loanResponse
      });
    } catch (error) {
      console.error('Error al devolver libro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async getOverdueLoans(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      const loans = await Loan.find({
        $or: [
          { status: LoanStatus.ACTIVE, dueDate: { $lt: today } }
        ]
      })
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author')
      .exec();
      
      res.json(loans);
    } catch (error) {
      console.error('Error al obtener préstamos vencidos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async updateOverdueLoans(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      
      const overdueLoans = await Loan.find({
        status: LoanStatus.ACTIVE,
        dueDate: { $lt: today }
      });
      
      if (overdueLoans.length === 0) {
        res.json({ message: 'No hay préstamos vencidos para actualizar' });
        return;
      }
      
      let updatedCount = 0;
      for (const loan of overdueLoans) {
        loan.status = LoanStatus.OVERDUE;
        await loan.save();
        updatedCount++;
      }
      
      res.json({ 
        message: `Se han actualizado ${updatedCount} préstamos vencidos`,
        updatedLoans: overdueLoans 
      });
    } catch (error) {
      console.error('Error al actualizar préstamos vencidos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}