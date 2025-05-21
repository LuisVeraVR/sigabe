import { Router } from "express";
import { createBook, getBooks, updateBookAuthor } from "../controller/book.controller";

const router = Router();

router.post("/", createBook); 
router.get("/", getBooks); 
router.put("/:id/author", updateBookAuthor); 

export default router;