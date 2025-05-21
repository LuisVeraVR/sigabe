
import { DataSource } from "typeorm";
import { Writer } from "../entity/writers";
import { Book } from "../entity/book";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  synchronize: true, 
  logging: false, 
  entities: [Writer, Book],
});