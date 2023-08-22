import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ItemModel } from '../form-state/model';

const MOCK_API_DELAY_MS = 300;

@Injectable({
  providedIn: 'root'
})
export class RecalculateApiService {

  constructor() { }

  recalculateRows(rowsToRecalculate: RecalculationRow[]): Observable<RecalculationRow[]> {
    const result = rowsToRecalculate.map(row => {
      if (row.changedField.endsWith('totalPrice')) {
        return { ...row, price: row.amount ? (row.totalPrice / row.amount) : 0 };
      } else {
        return { ...row, totalPrice: row.price * row.amount };
      }
    });
    return of(result).pipe(
      delay(MOCK_API_DELAY_MS)
    );
  }
}

export interface RecalculationRow extends ItemModel {
  changedField: string;
}
