import { createAction, props } from '@ngrx/store';
import { Book, ReadingListItem } from '@tmo/shared/models';

export const init = createAction('[Reading List] Initialize');

export const loadReadingListSuccess = createAction(
  '[Reading List API] Load list success',
  props<{ list: ReadingListItem[] }>()
);
export const loadReadingListError = createAction(
  '[Reading List API] Load list error',
  props<{ error: string }>()
);

export const addToReadingList = createAction(
  '[Books Search Results] Add to list',
  props<{ book: Book }>()
);

export const failedAddToReadingList = createAction(
  '[Reading List API] Failed add to list',
  props<{ book: Book }>()
);

export const confirmedAddToReadingList = createAction(
  '[Reading List API] Confirmed add to list',
  props<{ book: Book }>()
);

export const removeFromReadingList = createAction(
  '[Books Search Results] Remove from list',
  props<{ item: ReadingListItem }>()
);

export const failedRemoveFromReadingList = createAction(
  '[Reading List API] Failed remove from list',
  props<{ item: ReadingListItem }>()
);

export const confirmedRemoveFromReadingList = createAction(
  '[Reading List API] Confirmed remove from list',
  props<{ item: ReadingListItem }>()
);

export const undoAction = createAction('[Undo] Perform Undo',

);

export const markAsFinishedConfirmed = createAction(
  '[Reading List] Mark as Finished Confirmed',
  props<{ item: ReadingListItem }>()
);

export const markAsFinished = createAction(
  '[Reading List] Mark as Finished',
  props<{ item: ReadingListItem }>()
);

export const markAsFinishedSuccess = createAction(
  '[Reading List API] Mark as Finished Success',
  props<{ item: ReadingListItem }>()
);

export const markAsFinishedFailure = createAction(
  '[Reading List API] Mark as Finished Failure',
  props<{ error: any }>()
);

