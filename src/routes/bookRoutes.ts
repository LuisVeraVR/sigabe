import { Router } from "express";
import { createBook, getBooks, updateBook, deleteBook } from "../controller/bookController";

const router = Router();

router.post("/createBook", createBook);
router.get("/getBooks", getBooks);
router.put("/updateBook/:id", updateBook);
router.delete("/deleteBook/:id", deleteBook);

export default router;