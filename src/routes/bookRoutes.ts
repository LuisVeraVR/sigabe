import { Router } from "express";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controller/bookController";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateJWT);

router.post("/createBook", createBook);
router.get("/getBooks", getBooks);
router.get("/getBooks/:id", getBookById); 
router.put("/updateBook/:id", updateBook);
router.delete("/deleteBook/:id", deleteBook);

export default router;