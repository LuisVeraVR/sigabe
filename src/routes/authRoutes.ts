import { Router } from "express";
import { AuthController } from "../controller/authController";
import { authenticateJWT } from "../middleware/auth.middleware";
import { body, ValidationChain } from "express-validator";
import { validateRequest } from "../middleware/validation.middleware";

const router = Router();

const emailValidation: ValidationChain = body("email")
  .isEmail()
  .withMessage("Debe proporcionar un email válido");

const passwordValidation: ValidationChain = body("password")
  .isLength({ min: 6 })
  .withMessage("La contraseña debe tener al menos 6 caracteres");

const firstNameValidation: ValidationChain = body("firstName")
  .notEmpty()
  .withMessage("El nombre es requerido");

const lastNameValidation: ValidationChain = body("lastName")
  .notEmpty()
  .withMessage("El apellido es requerido");

router.post(
  "/register",
  [
    emailValidation,
    passwordValidation,
    firstNameValidation,
    lastNameValidation,
  ],
  validateRequest,
  AuthController.register
);

router.post(
  "/login",
  [
    emailValidation,
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ],
  validateRequest,
  AuthController.login
);
router.get("/getUsers", authenticateJWT, AuthController.getUsers);
router.get("/profile", authenticateJWT, AuthController.getProfile);

export default router;
