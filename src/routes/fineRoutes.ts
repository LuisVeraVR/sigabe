import { Router } from "express";
import { FineController } from "../controller/fineController";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import {
  fineIdValidation,
  payFineValidation,
  userIdValidation
} from "../validations/fine.validation";

const router = Router();

router.use(authenticateJWT);

router.get("/", FineController.getFines);

router.get(
  "/user/:userId",
  userIdValidation,
  validateRequest,
  FineController.getFinesByUser
);

router.get(
  "/:id",
  fineIdValidation,
  validateRequest,
  FineController.getFineById
);

router.patch(
  "/:id/pay",
  payFineValidation,
  validateRequest,
  FineController.payFine
);

router.get(
  "/user/:userId/pending-total",
  userIdValidation,
  validateRequest,
  FineController.getUserPendingTotal
);

router.get("/stats/summary", FineController.getFineStats);

export default router;