import { AppDataSource } from "../config/database";
import { Writer } from "../entity/writers";

export const WriterRepo = AppDataSource.getRepository(Writer);