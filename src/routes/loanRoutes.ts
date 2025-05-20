import { Router } from "express";
import { LoanController } from "../controller/loanController";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import {
  createLoanValidation,
  returnBookValidation,
  loanIdValidation,
  userIdValidation
} from "../validations/loan.validation";

const router = Router();

router.use(authenticateJWT);

router.post(
  "/",
  createLoanValidation,
  validateRequest,
  LoanController.createLoan
);

router.get("/", LoanController.getLoans);

router.get(
  "/user/:userId",
  userIdValidation,
  validateRequest,
  LoanController.getLoansByUser
);

router.get(
  "/:id",
  loanIdValidation,
  validateRequest,
  LoanController.getLoanById
);

router.patch(
  "/:id/return",
  returnBookValidation,
  validateRequest,
  LoanController.returnBook
);

router.get("/status/overdue", LoanController.getOverdueLoans);
router.post("/update-overdue", LoanController.updateOverdueLoans);

export default router;