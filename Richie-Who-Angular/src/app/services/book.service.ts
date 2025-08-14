import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Book } from '../models/book.model';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor() {}

  getBooks(): {};

  getBook(id) {}

  createBook(book) {}

  updateBook(id, book) {}

  deleteBook(id) {}
}
