import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList,undoAction,ReadingListBook } from '@tmo/books/data-access';
import { Subscription } from 'rxjs';
import { SharedService } from '../sharedservice/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this.confirmAction('Book removed', item);
  }
  undoAction() {
    this.store.dispatch(undoAction());
  }


  confirmAction(msg: string, item: any) {
    let snackBarRef = this.snackBar.open(msg, 'Undo', {
      duration: 3000
    });

    snackBarRef.onAction().subscribe(() => {
      console.log('undo');
      this.store.dispatch(undoAction());
      this.snackBar.dismiss();
    });
  }
  refreshReadingList() {

    this.readingList$ = this.store.select(getReadingList);
  }



}
