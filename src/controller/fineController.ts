import { Request, Response } from 'express';
import { Fine, FineStatus } from '../entity/fine';
import { Loan } from '../entity/loan';
import { PayFineDto } from '../interfaces/fine.interface';
import mongoose from 'mongoose';

export class FineController {
  
  static async getFines(req: Request, res: Response): Promise<void> {
    try {
      const fines = await Fine.find()
        .populate({
          path: 'loan',
          populate: [
            { path: 'user', select: 'firstName lastName' },
            { path: 'book', select: 'title' }
          ]
        })
        .exec();
      
      const formattedFines = fines.map(fine => {
        const loan = fine.loan as any;
        return {
          id: fine._id,
          loan: {
            id: loan._id,
            bookTitle: loan.book?.title || 'Unknown',
            userName: loan.user ? `${loan.user.firstName} ${loan.user.lastName}` : 'Unknown',
            loanDate: loan.loanDate,
            dueDate: loan.dueDate,
            returnDate: loan.returnDate
          },
          amount: fine.amount,
          createdAt: fine.createdAt,
          paidAt: fine.paidAt,
          status: fine.status
        };
      });
      
      res.json(formattedFines);
    } catch (error) {
      console.error('Error al obtener multas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async getFinesByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return;
      }
      
      const loans = await Loan.find({ user: userId }).select('_id');
      const loanIds = loans.map(loan => loan._id);
      
      const fines = await Fine.find({ loan: { $in: loanIds } })
        .populate({
          path: 'loan',
          populate: [
            { path: 'user', select: 'firstName lastName' },
            { path: 'book', select: 'title' }
          ]
        })
        .exec();
      
      const formattedFines = fines.map(fine => {
        const loan = fine.loan as any;
        return {
          id: fine._id,
          loan: {
            id: loan._id,
            bookTitle: loan.book?.title || 'Unknown',
            userName: loan.user ? `${loan.user.firstName} ${loan.user.lastName}` : 'Unknown',
            loanDate: loan.loanDate,
            dueDate: loan.dueDate,
            returnDate: loan.returnDate
          },
          amount: fine.amount,
          createdAt: fine.createdAt,
          paidAt: fine.paidAt,
          status: fine.status
        };
      });
      
      res.json(formattedFines);
    } catch (error) {
      console.error('Error al obtener multas del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
   static async getFineById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID inválido' });
        return;
      }
      
      const fine = await Fine.findById(id)
        .populate({
          path: 'loan',
          populate: [
            { path: 'user', select: 'firstName lastName' },
            { path: 'book', select: 'title' }
          ]
        })
        .exec();
      
      if (!fine) {
        res.status(404).json({ message: 'Multa no encontrada' });
        return;
      }
      
      const loan = fine.loan as any;
      const formattedFine = {
        id: fine._id,
        loan: {
          id: loan._id,
          bookTitle: loan.book?.title || 'Unknown',
          userName: loan.user ? `${loan.user.firstName} ${loan.user.lastName}` : 'Unknown',
          loanDate: loan.loanDate,
          dueDate: loan.dueDate,
          returnDate: loan.returnDate
        },
        amount: fine.amount,
        createdAt: fine.createdAt,
        paidAt: fine.paidAt,
        status: fine.status
      };
      
      res.json(formattedFine);
    } catch (error) {
      console.error('Error al obtener multa:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async payFine(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID inválido' });
        return;
      }
      
      const fine = await Fine.findById(id);
      
      if (!fine) {
        res.status(404).json({ message: 'Multa no encontrada' });
        return;
      }
      
      if (fine.status === FineStatus.PAID) {
        res.status(400).json({ message: 'Esta multa ya ha sido pagada' });
        return;
      }
      
      const { paidAt }: PayFineDto = req.body;
      fine.paidAt = paidAt ? new Date(paidAt) : new Date();
      fine.status = FineStatus.PAID;
      
      await fine.save();
      
      res.json({
        message: 'Multa pagada exitosamente',
        fine
      });
    } catch (error) {
      console.error('Error al pagar multa:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async getUserPendingTotal(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return;
      }
      
      const loans = await Loan.find({ user: userId }).select('_id');
      const loanIds = loans.map(loan => loan._id);
      
      const fines = await Fine.find({
        loan: { $in: loanIds },
        status: FineStatus.PENDING
      });
      
      const total = fines.reduce((sum, fine) => sum + fine.amount, 0);
      
      res.json({ userId, totalPendingFines: total });
    } catch (error) {
      console.error('Error al obtener total de multas pendientes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  static async getFineStats(req: Request, res: Response): Promise<void> {
    try {
      const totalCount = await Fine.countDocuments();
      
      const pendingCount = await Fine.countDocuments({ status: FineStatus.PENDING });
      
      const paidCount = await Fine.countDocuments({ status: FineStatus.PAID });
      
      const fines = await Fine.find();
      const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);
      
      const pendingFines = await Fine.find({ status: FineStatus.PENDING });
      const pendingAmount = pendingFines.reduce((sum, fine) => sum + fine.amount, 0);
      
      const paidFines = await Fine.find({ status: FineStatus.PAID });
      const paidAmount = paidFines.reduce((sum, fine) => sum + fine.amount, 0);
      
      res.json({
        totalCount,
        pendingCount,
        paidCount,
        totalAmount,
        pendingAmount,
        paidAmount
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de multas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}