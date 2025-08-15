import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private auth: AuthServiceService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }
  loadBooks() {
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
    });
  }

  onLogout() {
    this.auth.signout();
    console.log('signout ok');
  }
}
