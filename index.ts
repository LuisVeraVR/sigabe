import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./src/data-source";
import bookRoutes from './src/routes/bookRoutes';
import authRoutes from './src/routes/authRoutes';
import cors from 'cors';
import dotenv from 'dotenv';
import loanRoutes from "./src/routes/loanRoutes";
import fineRoutes from "./src/routes/fineRoutes";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['https://sigabe-frontend.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes); 
app.use('/api/fines', fineRoutes); 
app.use('/api/auth', authRoutes); 

AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida");

    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    }
  })
  .catch((error: Error) => console.error("Error al conectar a la base de datos:", error));

export default app;