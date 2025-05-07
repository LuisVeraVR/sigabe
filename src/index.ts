import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import bookRoutes from './routes/bookRoutes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/books', bookRoutes); 

// Inicializar la conexión con la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida");

    // Iniciar el servidor
    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((error) => console.error("Error al conectar a la base de datos:", error));