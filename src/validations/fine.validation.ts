import { body, param, ValidationChain } from "express-validator";

export const fineIdValidation: ValidationChain[] = [
  param("id")
    .isInt()
    .withMessage("El ID de multa debe ser un número entero")
];

export const payFineValidation: ValidationChain[] = [
  param("id")
    .isInt()
    .withMessage("El ID de multa debe ser un número entero"),
  
  body("paidAt")
    .optional()
    .isISO8601()
    .withMessage("La fecha de pago debe ser una fecha válida en formato ISO8601")
];

export const userIdValidation: ValidationChain[] = [
  param("userId")
    .isInt()
    .withMessage("El ID de usuario debe ser un número entero")
];