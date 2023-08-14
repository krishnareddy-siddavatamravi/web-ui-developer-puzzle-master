import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  removeFromReadingList,
  getReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  undoAction,
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  
  books: ReadingListBook[];
  

  searchForm = this.fb.group({
    term: ''
  });
  searching = false;


  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    public snackBar: MatSnackBar,
  ) 
  {
    this.searchForm.controls.term.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        debounceTime(500);
        this.searchBooks(); 
      });
  }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    this.confirmAction(`${book.title} Book Removed`,book)
  }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.confirmAction(`${item.title} Book Removed`, item);
  }
  

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    const term = this.searchForm.value.term;
    if (term) {
      this.searching = true;
      this.store.dispatch(searchBooks({ term }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  undo = false;
  confirmAction(msg:string, book:Book){
    this.undo = false;
    let snackBarRef = this.snackBar.open(msg, 'Undo', {
      duration: 3000
    });

    snackBarRef.onAction().subscribe(() => {
      this.undo = true;
      this.store.dispatch(undoAction());
      this.snackBar.dismiss();
    });
  }

  isFinished(book: ReadingListBook): boolean {
    return this.books.some(b => b.id === book.id && b.finished);
  }

}
