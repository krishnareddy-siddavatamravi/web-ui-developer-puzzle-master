import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList,undoAction,ReadingListBook, markAsFinished } from '@tmo/books/data-access';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {

  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private snackBar: MatSnackBar) {
  }
  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.confirmAction(`${item.title} Book Removed`, item);
  }
  undoAction() {
    this.store.dispatch(undoAction());
  }
  
  markAsFinished(item: ReadingListItem) {
    this.store.dispatch(markAsFinished({ item }));
    this.confirmAction(`${item.title} marked as finished`, item);
  }

  confirmAction(msg: string, item: any) {
    let snackBarRef = this.snackBar.open(msg, 'Undo', {
      duration: 3000
    });

    snackBarRef.onAction().subscribe(() => {
      this.store.dispatch(undoAction());
      this.snackBar.dismiss();
    });
  }
  refreshReadingList() {
    this.readingList$ = this.store.select(getReadingList);
  }

}
