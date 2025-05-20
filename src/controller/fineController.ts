import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Fine, FineStatus } from "../entity/fine";
import { PayFineDto } from "../interfaces/fine.interface";

const fineRepository = AppDataSource.getRepository(Fine);

export class FineController {
  
  static async getFines(req: Request, res: Response): Promise<void> {
    try {
      const fines = await fineRepository.find({
        relations: ["loan", "loan.user", "loan.book"]
      });
      
      const formattedFines = fines.map(fine => ({
        id: fine.id,
        loan: {
          id: fine.loan.id,
          bookTitle: fine.loan.book.title,
          userName: `${fine.loan.user.firstName} ${fine.loan.user.lastName}`,
          loanDate: fine.loan.loanDate,
          dueDate: fine.loan.dueDate,
          returnDate: fine.loan.returnDate
        },
        amount: fine.amount,
        createdAt: fine.createdAt,
        paidAt: fine.paidAt,
        status: fine.status
      }));
      
      res.json(formattedFines);
    } catch (error) {
      console.error("Error al obtener multas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getFinesByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ message: "ID de usuario inválido" });
        return;
      }
      
      const fines = await fineRepository
        .createQueryBuilder("fine")
        .innerJoinAndSelect("fine.loan", "loan")
        .innerJoinAndSelect("loan.user", "user")
        .innerJoinAndSelect("loan.book", "book")
        .where("user.id = :userId", { userId })
        .getMany();
      
      const formattedFines = fines.map(fine => ({
        id: fine.id,
        loan: {
          id: fine.loan.id,
          bookTitle: fine.loan.book.title,
          userName: `${fine.loan.user.firstName} ${fine.loan.user.lastName}`,
          loanDate: fine.loan.loanDate,
          dueDate: fine.loan.dueDate,
          returnDate: fine.loan.returnDate
        },
        amount: fine.amount,
        createdAt: fine.createdAt,
        paidAt: fine.paidAt,
        status: fine.status
      }));
      
      res.json(formattedFines);
    } catch (error) {
      console.error("Error al obtener multas del usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getFineById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }
      
      const fine = await fineRepository.findOne({
        where: { id },
        relations: ["loan", "loan.user", "loan.book"]
      });
      
      if (!fine) {
        res.status(404).json({ message: "Multa no encontrada" });
        return;
      }
      
      const formattedFine = {
        id: fine.id,
        loan: {
          id: fine.loan.id,
          bookTitle: fine.loan.book.title,
          userName: `${fine.loan.user.firstName} ${fine.loan.user.lastName}`,
          loanDate: fine.loan.loanDate,
          dueDate: fine.loan.dueDate,
          returnDate: fine.loan.returnDate
        },
        amount: fine.amount,
        createdAt: fine.createdAt,
        paidAt: fine.paidAt,
        status: fine.status
      };
      
      res.json(formattedFine);
    } catch (error) {
      console.error("Error al obtener multa:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async payFine(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }
      
      const fine = await fineRepository.findOne({
        where: { id },
        relations: ["loan"]
      });
      
      if (!fine) {
        res.status(404).json({ message: "Multa no encontrada" });
        return;
      }
      
      if (fine.status === FineStatus.PAID) {
        res.status(400).json({ message: "Esta multa ya ha sido pagada" });
        return;
      }
      
      const { paidAt }: PayFineDto = req.body;
      fine.paidAt = paidAt ? new Date(paidAt) : new Date();
      fine.status = FineStatus.PAID;
      
      await fineRepository.save(fine);
      
      res.json({
        message: "Multa pagada exitosamente",
        fine
      });
    } catch (error) {
      console.error("Error al pagar multa:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getUserPendingTotal(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ message: "ID de usuario inválido" });
        return;
      }
      
      const result = await fineRepository
        .createQueryBuilder("fine")
        .innerJoin("fine.loan", "loan")
        .innerJoin("loan.user", "user")
        .where("user.id = :userId", { userId })
        .andWhere("fine.status = :status", { status: FineStatus.PENDING })
        .select("SUM(fine.amount)", "total")
        .getRawOne();
      
      const total = result.total ? parseFloat(result.total) : 0;
      
      res.json({ userId, totalPendingFines: total });
    } catch (error) {
      console.error("Error al obtener total de multas pendientes:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  static async getFineStats(req: Request, res: Response): Promise<void> {
    try {
      const totalCount = await fineRepository.count();
      
      const pendingCount = await fineRepository.count({
        where: { status: FineStatus.PENDING }
      });
      
      const paidCount = await fineRepository.count({
        where: { status: FineStatus.PAID }
      });
      
      const totalAmountResult = await fineRepository
        .createQueryBuilder("fine")
        .select("SUM(fine.amount)", "total")
        .getRawOne();
      
      const totalAmount = totalAmountResult.total ? parseFloat(totalAmountResult.total) : 0;
      
      const pendingAmountResult = await fineRepository
        .createQueryBuilder("fine")
        .where("fine.status = :status", { status: FineStatus.PENDING })
        .select("SUM(fine.amount)", "total")
        .getRawOne();
      
      const pendingAmount = pendingAmountResult.total ? parseFloat(pendingAmountResult.total) : 0;
      
      const paidAmountResult = await fineRepository
        .createQueryBuilder("fine")
        .where("fine.status = :status", { status: FineStatus.PAID })
        .select("SUM(fine.amount)", "total")
        .getRawOne();
      
      const paidAmount = paidAmountResult.total ? parseFloat(paidAmountResult.total) : 0;
      
      res.json({
        totalCount,
        pendingCount,
        paidCount,
        totalAmount,
        pendingAmount,
        paidAmount
      });
    } catch (error) {
      console.error("Error al obtener estadísticas de multas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}