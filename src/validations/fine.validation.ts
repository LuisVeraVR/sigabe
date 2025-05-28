import { body, param, ValidationChain } from "express-validator";
import mongoose from "mongoose";

export const fineIdValidation: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("El ID de multa es requerido")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("El ID de multa debe ser un ID de MongoDB válido")
];

export const payFineValidation: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("El ID de multa es requerido")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("El ID de multa debe ser un ID de MongoDB válido"),
  
  body("paidAt")
    .optional()
    .isISO8601()
    .withMessage("La fecha de pago debe ser una fecha válida en formato ISO8601")
];

export const userIdValidation: ValidationChain[] = [
  param("userId")
    .notEmpty()
    .withMessage("El ID de usuario es requerido")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("El ID de usuario debe ser un ID de MongoDB válido")
];