import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entity/book"; // Asegúrate de que la ruta sea correcta

export const AppDataSource = new DataSource({
  type: "sqlite", // Tipo de base de datos
  database: "database.sqlite", // Nombre del archivo de la base de datos
  synchronize: true, // Sincroniza automáticamente las entidades con la base de datos (solo para desarrollo)
  logging: false, // Cambia a true si necesitas ver las consultas SQL en la consola
  entities: [Book], // Lista de entidades
  migrations: [], // Lista de migraciones (si las usas)
  subscribers: [], // Lista de suscriptores (si los usas)
});