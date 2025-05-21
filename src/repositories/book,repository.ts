import { AppDataSource } from "../config/database";
import { Book } from "../entity/book";

export const BookRepo = AppDataSource.getRepository(Book);