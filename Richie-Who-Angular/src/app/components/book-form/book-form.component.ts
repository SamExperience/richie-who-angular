import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { NgModel, NgControl, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent {
  book: Book = {
    id: '',
    title: '',
    author: '',
    description: '',
    coverUrl: '',
    createdAt: 0,
  };
  constructor() {}

  submitForm() {
    console.log(this.book);
    this.resetForm();
  }
  resetForm() {
    this.book = {
      id: '',
      title: '',
      author: '',
      description: '',
      coverUrl: '',
      createdAt: 0,
    };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.book.coverUrl = file.name; // o usa FileReader per preview
    }
  }
}
