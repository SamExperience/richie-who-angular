import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { Book } from '../models/book.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  /*ENDPOINT Firestore */
  private baseUrl =
    'https://firestore.googleapis.com/v1/projects/richiewho/databases/(default)/documents/books';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /* GET BOOKS
    this function return an Book[]. 
    We use map for each element from firestore for setting in Book obj the result. 
    In this way the component read a Book array ready to use.
  */
  getBooks(): Observable<Book[]> {
    return this.http
      .get<any>(this.baseUrl, { headers: this.getAuthHeaders() })
      .pipe(
        map(
          (res) =>
            res.documents?.map((doc: any) => this.mapFirestoreDocToBook(doc)) || //mapFirestoreDocToBook convert data from firestore (fields.stringValue) in Book
            []
        )
      );
  }

  /* GET SINGLE BOOK
  this funcion return an "Observable<Book>" single book that we retray from firestore and
   we convert in Book using the function mapFirestoreDocToBook.
*/
  getBook(id: string): Observable<Book> {
    const url = `${this.baseUrl}/${id}`; // endpoint firestore

    return this.http
      .get<any>(url, { headers: this.getAuthHeaders() })
      .pipe(map((doc) => this.mapFirestoreDocToBook(doc)));
  }

  /* CREATE A NEW BOOK
  This function create a new book.
  Create a body in firestore REST format "fields.stringValue".
  Executes POST in /documents/books for create a new book
  Receives the new book created

*/
  createBook(book: Book): Observable<Book> {
    const body = {
      //standard format for firestore
      fields: {
        title: { stringValue: book.title },
        author: { stringValue: book.author },
        description: { stringValue: book.description },
        coverUrl: { stringValue: book.coverUrl },
        createdAt: { integerValue: book.createdAt },
      },
    };

    return this.http
      .post<any>(this.baseUrl, body, { headers: this.getAuthHeaders() }) //executes a POST for create a new book
      .pipe(map((doc) => this.mapFirestoreDocToBook(doc))); // converts the received data into a book
  }

  /* UPDATE A BOOK
    This function update a book
    Building a body.field and use only the data in book for dont deleted another dataCreate an update mask. Firestore uses it to know which data is being updated, without risking data loss.
    ex: if book{title: 'x', year: 2020} so updateMask ->updateMask.fieldPaths=title&updateMask.fieldPaths=year
    In the end map the answer in book
  */
  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    const body = {
      // format for Firestore body.field
      fields: {
        ...(book.title && { title: { stringValue: book.title } }),
        ...(book.author && { author: { stringValue: book.author } }),
        ...(book.description && {
          description: { stringValue: book.description },
        }),
        ...(book.coverUrl && { coverUrl: book.coverUrl }),
        ...(book.createdAt && { year: { integerValue: book.createdAt } }),
      },
    };

    const updateMask = Object.keys(book) // Firestore use updateMask for to know wich data update
      .map((k) => `updateMask.fieldPaths=${k}`)
      .join('&');

    const url = `${this.baseUrl}/${id}?${updateMask}`; //endpoit firestore
    return this.http
      .patch<any>(url, body, { headers: this.getAuthHeaders() }) //PATCH with updateMask allows partial updates without loss data
      .pipe(map((doc) => this.mapFirestoreDocToBook(doc))); // return a book
  }

  /* DELETE A BOOK
  this function delete a book  
*/
  deleteBook(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`; //endpoint Firestore

    return this.http.delete<void>(url, { headers: this.getAuthHeaders() }); //delete-> method HTTP
  }

  /* BUILD HTTPHeaders */
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getAccessToken(); //retrieve saved token -> string|null
    return new HttpHeaders({ Authorization: `Bearer ${token}` }); // return a HttpHeaders object with new token. Bearer is the standard for send a JWT/ID. if toke is null ->Authorization: "Bearer null"
  }

  /*CONVERT DOC IN BOOK */
  private mapFirestoreDocToBook(doc: any): Book {
    return {
      id: doc.name.split('/').pop(),
      title: doc.fields?.title?.stringValue || '',
      author: doc.fields?.author?.stringValue || '',
      description: doc.fields?.description?.stringValue || '',
      coverUrl: doc.fields?.coverUrl?.stringValue || '',
      createdAt: parseInt(doc.fields?.createdAt?.integerValue || '0', 10),
    };
  }
}
