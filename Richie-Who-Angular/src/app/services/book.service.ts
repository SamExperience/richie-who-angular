import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { Book } from '../models/book.model';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  //endpoint firestore
  private baseUrl =
    'https://firestore.googleapis.com/v1/projects/richiewho/databases/(default)/documents/books';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getBooks() {
    const token = this.tokenService.getAccessToken(); //retrieve saved token
    const headers = new HttpHeaders({
      //create a obj for HTTP headers
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.baseUrl, { headers }); // req to endpoint firestore
  }

  getBook(id) {}

  createBook(book: {
    title: string;
    author: string;
    description: string;
    year: number;
  }) {
    const token = this.tokenService.getAccessToken();

    /* 
      header with Bearer it's used by 
      firestore to check if the user is logged in
     */
    const headers = new HttpHeaders({
      //create a obj for HTTP headers
      Authorization: `Bearer ${token}`,
    });

    // body in format "fields" for Firestore
    const body = {
      fields: {
        title: { stringValue: book.title },
        author: { stringValue: book.author },
        year: { integerValue: book.year },
      },
    };

    return this.http.post(this.baseUrl, body, { headers }); // create a document into the collection "books"
  }

  updateBook(
    id: string,
    book: {
      title?: string;
      author?: string;
      description?: string;
      year?: number;
    }
  ) {
    const token = this.tokenService.getAccessToken(); //retrieve saved token
    const headers = new HttpHeaders({
      //create a obj for HTTP headers
      Authorization: `Bearer ${token}`,
    });

    const body = {
      fields: {
        // ...((condition) && .. means if book.title exist you can replace)
        ...(book.title && book.title && { title: { stringValue: book.title } }),
        ...(book.author && { title: { stringValue: book.author } }),
        ...(book.description && { title: { stringValue: book.description } }),
        ...(book.year && book.year && { title: { stringValue: book.year } }),
      },
    };
    /* 
      With updateMask you can update the indicated fields
      without deleting the unindicated ones. 
      Without updateMask the unindicated fields will be deleted.
     */
    const updateMask = Object.keys(book)
      .map((k) => `updateMask.fieldPaths=${k}`)
      .join('&');

    const url = `${this.baseUrl}/${id}?${updateMask}`; //I build URL endpoints for update the book

    return this.http.patch(url, body, { headers }); //patch -> HTTP method used to partially update a document.
  }

  deleteBook(id: string) {
    const token = this.tokenService.getAccessToken(); //retrieve saved token
    const headers = new HttpHeaders({
      //create a obj for HTTP headers
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.baseUrl}/${id}`; //I build URL endpoints for delete

    return this.http.delete(url, { headers }); //delete-> method HTTP
  }
}
