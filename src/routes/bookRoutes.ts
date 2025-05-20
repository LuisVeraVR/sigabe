import { Router } from "express";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controller/bookController";

const router = Router();

router.post("/createBook", createBook);
router.get("/getBooks", getBooks);
router.get("/getBooks/:id", getBookById); 
router.put("/updateBook/:id", updateBook);
router.delete("/deleteBook/:id", deleteBook);

export default router;