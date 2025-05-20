import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entity/book"; 
import * as path from "path";
import { User } from "./entity/user";
import { Loan } from "./entity/loan";
import { Fine } from "./entity/fine";

const isDevelopment = process.env.NODE_ENV !== "production";

export const AppDataSource = new DataSource({
  type: "sqlite", 
  database: isDevelopment 
    ? "database.sqlite" 
    : path.join("/tmp", "database.sqlite"),
  synchronize: true, 
  logging: false,
  entities: [Book, User, Loan, Fine],
  migrations: [], 
  subscribers: [], 
});