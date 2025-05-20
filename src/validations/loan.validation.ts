import { body, param, ValidationChain } from "express-validator";

export const createLoanValidation: ValidationChain[] = [
  body("userId")
    .isInt()
    .withMessage("El ID de usuario debe ser un número entero"),
  
  body("bookId")
    .isInt()
    .withMessage("El ID del libro debe ser un número entero"),
  
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
    .isInt()
    .withMessage("El ID de préstamo debe ser un número entero"),
  
  body("returnDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de devolución debe ser una fecha válida en formato ISO8601")
];

export const loanIdValidation: ValidationChain[] = [
  param("id")
    .isInt()
    .withMessage("El ID de préstamo debe ser un número entero")
];

export const userIdValidation: ValidationChain[] = [
  param("userId")
    .isInt()
    .withMessage("El ID de usuario debe ser un número entero")
];