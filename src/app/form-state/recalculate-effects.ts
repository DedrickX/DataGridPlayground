import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SetValueAction } from 'ngrx-forms';
import { debounceTime, filter, map, mergeMap, MonoTypeOperatorFunction, Observable, tap } from 'rxjs';
import { RecalculateApiService } from '../recalculate-api-service/recalculate-api.service';
import { recalculateActions } from './recalculate-actions';
import { itemsFormStateSelector, recalculateInProgressSelector } from './state';

@Injectable()
export class RecalculateEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private recalculateService: RecalculateApiService,
  ) {}

  readonly recalculateRows$ = createEffect(() => this.actions$.pipe(
    ofType(recalculateActions.recalculateRows),
    mergeMap(action => this.recalculateService.recalculateRows(action.rowsToRecalculate)),
    map(recalculatedRows => recalculateActions.recalculateRowsResult({ recalculatedRows }))
  ));

  readonly recalculateRowsTrigger$ = createEffect(() => this.actions$.pipe(
    ofType(SetValueAction.TYPE),
    filter((action: SetValueAction<any>) => /testForm\.items\.\d+\.(price|amount|totalPrice)$/.test(action.controlId)),
    this.setRecalculationInProgress(),
    debounceTime(300),
    concatLatestFrom(() => this.store.select(itemsFormStateSelector)),
    map(([action, items]) => {
        const indexSearch = action.controlId.match(/\d+/);
        const index = indexSearch ? +indexSearch[0] : null;
        if (index === null) {
            throw new Error('Index of changed item not found.');
        }
        return recalculateActions.recalculateRows({
            rowsToRecalculate: [{
                ...items.value[index],
                changedField: action.controlId,
            }]
        });
    }))
  );

  // --------------------
  // side effect operator for setting calculation progress by dispatching action to set it true, but if it is not already true
  // it returns MonoTypeOperatorFunction, so it can be used within pipe, and it will preserve type of stream
  private setRecalculationInProgress<T>(): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => source.pipe(
      concatLatestFrom(() => this.store.select(recalculateInProgressSelector)),
      tap(([_, recalculateInProgress]) => { // this is intended side effect
        if (!recalculateInProgress) {
          this.store.dispatch(recalculateActions.setRecalculationProgress({ inProgress: true }));
        }
      }),
      map(([action, _]) => action) // we are throwing away recalculateInProgress to preserve stream type
    );
  }

}
