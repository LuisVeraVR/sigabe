import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./src/data-source";
import bookRoutes from './src/routes/bookRoutes';
import cors from 'cors';

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: ['https://sigabefront-three.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/books', bookRoutes); // Añadido prefijo /api para mejor organización

// Inicializar la conexión con la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida");

    // Iniciar el servidor solo si no estamos en Vercel
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    }
  })
  .catch((error: Error) => console.error("Error al conectar a la base de datos:", error));

// Exportar la app para Vercel
export default app;