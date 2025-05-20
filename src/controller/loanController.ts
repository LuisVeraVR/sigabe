import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/book";
import { User } from "../entity/user";
import { Loan, LoanStatus } from "../entity/loan";
import { Fine, FineStatus } from "../entity/fine";
import { CreateLoanDto, ReturnLoanDto } from "../interfaces/loan.interface";

const loanRepository = AppDataSource.getRepository(Loan);
const bookRepository = AppDataSource.getRepository(Book);
const userRepository = AppDataSource.getRepository(User);
const fineRepository = AppDataSource.getRepository(Fine);

const GRACE_PERIOD_DAYS = 0;
const DAILY_FINE_RATE = 5.00;

export class LoanController {
  
  static async createLoan(req: Request, res: Response): Promise<void> {
    try {
      const { userId, bookId, dueDate }: CreateLoanDto = req.body;
      
      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      
      const book = await bookRepository.findOneBy({ id: bookId });
      if (!book) {
        res.status(404).json({ message: "Libro no encontrado" });
        return;
      }
      
      if (!book.avaliable) {
        res.status(400).json({ message: "El libro no está disponible actualmente" });
        return;
      }
      
      const loan = new Loan();
      loan.user = user;
      loan.userId = userId;
      loan.book = book;
      loan.bookId = bookId;
      loan.dueDate = new Date(dueDate);
      loan.status = LoanStatus.ACTIVE;
      
      book.avaliable = false;
      await bookRepository.save(book);
      
      await loanRepository.save(loan);
      
      res.status(201).json({
        message: "Préstamo creado exitosamente",
        loan
      });
      
    } catch (error) {
      console.error("Error al crear préstamo:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getLoans(req: Request, res: Response): Promise<void> {
    try {
      const loans = await loanRepository.find({
        relations: ["user", "book", "fine"]
      });
      
      res.json(loans);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getLoansByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ message: "ID de usuario inválido" });
        return;
      }
      
      const loans = await loanRepository.find({
        where: { userId },
        relations: ["user", "book", "fine"]
      });
      
      res.json(loans);
    } catch (error) {
      console.error("Error al obtener préstamos del usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getLoanById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }
      
      const loan = await loanRepository.findOne({
        where: { id },
        relations: ["user", "book", "fine"]
      });
      
      if (!loan) {
        res.status(404).json({ message: "Préstamo no encontrado" });
        return;
      }
      
      res.json(loan);
    } catch (error) {
      console.error("Error al obtener préstamo:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async returnBook(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }
      
      const loan = await loanRepository.findOne({
        where: { id },
        relations: ["book"]
      });
      
      if (!loan) {
        res.status(404).json({ message: "Préstamo no encontrado" });
        return;
      }
      
      if (loan.status === LoanStatus.RETURNED) {
        res.status(400).json({ message: "Este libro ya ha sido devuelto" });
        return;
      }
      
      const { returnDate }: ReturnLoanDto = req.body;
      const actualReturnDate = returnDate ? new Date(returnDate) : new Date();
      loan.returnDate = actualReturnDate;
      
      const dueDate = new Date(loan.dueDate);
      dueDate.setDate(dueDate.getDate() + GRACE_PERIOD_DAYS);
      
      if (actualReturnDate > dueDate) {
        const timeDiff = actualReturnDate.getTime() - dueDate.getTime();
        const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        const fineAmount = daysLate * DAILY_FINE_RATE;
        
        const fine = new Fine();
        fine.loan = loan;
        fine.loanId = loan.id;
        fine.amount = fineAmount;
        fine.status = FineStatus.PENDING;
        
        await fineRepository.save(fine);
        
        loan.status = LoanStatus.OVERDUE;
      } else {
        loan.status = LoanStatus.RETURNED;
      }
      
      if (loan.book) {
        const book = await bookRepository.findOneBy({ id: loan.book.id });
        if (book) {
          book.avaliable = true;
          await bookRepository.save(book);
        }
      }
      
      await loanRepository.save(loan);
      
      const updatedLoan = await loanRepository.findOne({
        where: { id },
        relations: ["user", "book", "fine"]
      });
      
      res.json({
        message: "Libro devuelto exitosamente",
        loan: updatedLoan
      });
    } catch (error) {
      console.error("Error al devolver libro:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getOverdueLoans(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      const loans = await loanRepository.find({
        where: [
          { status: LoanStatus.ACTIVE, dueDate: LessThan(today) }
        ],
        relations: ["user", "book"]
      });
      
      res.json(loans);
    } catch (error) {
      console.error("Error al obtener préstamos vencidos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async updateOverdueLoans(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      
      const overdueLoans = await loanRepository.find({
        where: [
          { status: LoanStatus.ACTIVE, dueDate: LessThan(today) }
        ]
      });
      
      if (overdueLoans.length === 0) {
        res.json({ message: "No hay préstamos vencidos para actualizar" });
        return;
      }
      
      let updatedCount = 0;
      for (const loan of overdueLoans) {
        loan.status = LoanStatus.OVERDUE;
        await loanRepository.save(loan);
        updatedCount++;
      }
      
      res.json({ 
        message: `Se han actualizado ${updatedCount} préstamos vencidos`,
        updatedLoans: overdueLoans 
      });
    } catch (error) {
      console.error("Error al actualizar préstamos vencidos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

import { LessThan } from "typeorm";