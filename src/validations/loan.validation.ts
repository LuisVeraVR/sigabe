import { body, param, ValidationChain } from "express-validator";
import mongoose from "mongoose";

export const createLoanValidation: ValidationChain[] = [
  body("userId")
    .notEmpty()
    .withMessage("El ID de usuario es requerido")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("El ID de usuario debe ser un ID de MongoDB válido"),
  
  body("bookId")
    .notEmpty()
    .withMessage("El ID del libro es requerido")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("El ID del libro debe ser un ID de MongoDB válido"),
  
  body("dueDate")
    .isISO8601()
    .withMessage("La fecha de devolución debe ser una fecha válida en formato ISO8601")
    .custom((value) => {
      const dueDate = new Date(value);
      const today = new Date();
      
      if (dueDate <= today) {
        throw new Error("La fecha de devolución debe ser posterior a la fecha actual");
      }
      
      return true;
    })
];

export const returnBookValidation: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("El ID de préstamo es requerido")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("El ID de préstamo debe ser un ID de MongoDB válido"),
  
  body("returnDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de devolución debe ser una fecha válida en formato ISO8601")
];

export const loanIdValidation: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("El ID de préstamo es requerido")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("El ID de préstamo debe ser un ID de MongoDB válido")
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