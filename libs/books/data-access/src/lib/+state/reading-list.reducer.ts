  import { Action, createReducer, on } from '@ngrx/store';
  import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

  import * as ReadingListActions from './reading-list.actions';
  import { ReadingListItem } from '@tmo/shared/models';

  export const READING_LIST_FEATURE_KEY = 'readingList';

    // Define the custom interface that extends EntityState
    interface CustomEntityState<T> extends EntityState<T> {
      previousState: EntityState<T> | null;
    }

  export interface State extends CustomEntityState<ReadingListItem> {
    loaded: boolean;
    error: null | string;
  }

  export interface ReadingListPartialState {
    readonly [READING_LIST_FEATURE_KEY]: State;
  }

  export const readingListAdapter: EntityAdapter<ReadingListItem> = createEntityAdapter<
    ReadingListItem
  >({
    selectId: item => item.bookId
  });

  export const initialState: State = readingListAdapter.getInitialState({
    loaded: false,
    error: null,
    previousState: null
  });

  const readingListReducer = createReducer(
    initialState,
    on(ReadingListActions.init, state => {
      return {
        ...state,
        loaded: false,
        error: null
      };
    }),
    on(ReadingListActions.loadReadingListSuccess, (state, action) => {
      return readingListAdapter.setAll(action.list, {
        ...state,
        loaded: true
      });
    }),
    on(ReadingListActions.loadReadingListError, (state, action) => {
      return {
        ...state,
        error: action.error
      };
    }),
    on(ReadingListActions.addToReadingList, (state, action) => {
      const newState = readingListAdapter.addOne({ bookId: action.book.id, ...action.book }, state);
      return { ...newState, previousState: state };
    }),

    on(ReadingListActions.removeFromReadingList, (state, action) => {
      const newState = readingListAdapter.removeOne(action.item.bookId, state);
      return { ...newState, previousState: state };
    }),
    on(ReadingListActions.markAsFinishedSuccess, (state, action) => {
      const updatedItem = { ...action.item, finished: true };
      const newState = readingListAdapter.updateOne(
        { id: action.item.bookId, changes: updatedItem },
        { ...state, loaded: true }
      );
      return newState;
    }),
    on(ReadingListActions.markAsFinishedConfirmed, (state, { item }) => {
      return readingListAdapter.removeOne(item.bookId, state);
    }),

    // Implement the logic for undo action
    on(ReadingListActions.undoAction, state => {
      if (state.previousState) {
        return { ...state.previousState, previousState: null };
      }
      return state;
    })
    // on(ReadingListActions.addToReadingList, (state, action) =>
    //   readingListAdapter.addOne({ bookId: action.book.id, ...action.book }, state)
    // ),
    // // on(ReadingListActions.removeFromReadingList, (state, action) =>
    // //   readingListAdapter.removeOne(action.item.bookId, state)
    // // )
    // on(ReadingListActions.removeFromReadingList, (state, action) => {
    //   const newState = readingListAdapter.removeOne(action.item.bookId, state);
    //   return { ...newState, loaded: true };
    //   console.log(newState)
    //   console.log(action.item.bookId)
    //   // Set loaded to true after removing
    // })
  );

  export function reducer(state: State | undefined, action: Action) {
    return readingListReducer(state, action);
  };



