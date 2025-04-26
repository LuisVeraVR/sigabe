import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

const app = express();
app.use(express.json());

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