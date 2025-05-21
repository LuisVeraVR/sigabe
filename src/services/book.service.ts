import { BookRepo } from "../repositories/book,repository";
import { WriterRepo } from "../repositories/writter.repository";
import { Book } from "../entity/book";

export class BookService {
  async createBook(data: Partial<Book>): Promise<Book> {
    if(!data.author?.id) throw new Error("author.id obligatorio");
    const writer = await WriterRepo.findOneByOrFail({ id: data.author.id });
    const book = BookRepo.create({ ...data, author: writer });
    return BookRepo.save(book);
  }
  
  async getAllBooks(): Promise<Book[]> {
    return BookRepo.find({ relations: ["author"] });
  }
  
  async updateBookAuthor(bookId: number, writerId: number): Promise<Book> {
    const book = await BookRepo.findOneByOrFail({ id: bookId });
    book.author = await WriterRepo.findOneByOrFail({ id: writerId });
    return BookRepo.save(book);
  }
}