import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export class AuthController {
    
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, firstName, lastName } = req.body;
            
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOneBy({ email });
            
            if (existingUser) {
                res.status(400).json({ message: "El usuario ya existe" });
                return;
            }
            
            const user = new User();
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            const errors = await validate(user);
            if (errors.length > 0) {
                res.status(400).json({ errors });
                return;
            }
            
            await userRepository.save(user);
            
            const { password: _, ...userWithoutPassword } = user;
            
            res.status(201).json({
                message: "Usuario registrado exitosamente",
                user: userWithoutPassword
            });
        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ email });
            
            if (!user) {
                res.status(401).json({ message: "Credenciales inválidas" });
                return;
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                res.status(401).json({ message: "Credenciales inválidas" });
                return;
            }
            
            const token = jwt.sign(
                { userId: user.id, email: user.email, isAdmin: user.isAdmin },
                JWT_SECRET,
                { expiresIn: "24h" }
            );
            
            res.json({
                message: "Login exitoso",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin
                }
            });
        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
    static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Usuario no autenticado" });
                return;
            }
            
            const { password, ...userWithoutPassword } = req.user;
            
            res.json(userWithoutPassword);
        } catch (error) {
            console.error("Error al obtener el perfil:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    static async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const userRepository = AppDataSource.getRepository(User);
            
            const users = await userRepository.find({
                select: ["id", "firstName", "lastName", "email"]
            });
            
            res.json(users);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}