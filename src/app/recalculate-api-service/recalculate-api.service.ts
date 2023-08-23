import { Injectable } from '@angular/core';
import { delay, firstValueFrom, Observable, of } from 'rxjs';
import { ItemModel } from '../form-state/model';

const MOCK_API_DELAY_MS = 100;

@Injectable({
  providedIn: 'root'
})
export class RecalculateApiService {

  constructor() { }

  recalculateRows(rowsToRecalculate: RecalculationRow[]): Observable<RecalculationRow[]> {
    const result = rowsToRecalculate.map(row => this.recalculateCore(row));
    return of(result).pipe(
      delay(MOCK_API_DELAY_MS)
    );
  }
  recalculateRowAsync(rowToRecalculate: RecalculationRow): Promise<RecalculationRow> {
    const result = this.recalculateCore(rowToRecalculate);
    return firstValueFrom(of(result).pipe(
      delay(MOCK_API_DELAY_MS)
    ));
  }

  private recalculateCore(rowToRecalculate: RecalculationRow): RecalculationRow {
    if (rowToRecalculate.changedField.endsWith('totalPrice')) {
      return { ...rowToRecalculate, price: rowToRecalculate.amount ? (rowToRecalculate.totalPrice / rowToRecalculate.amount) : 0 };
    } else {
      return { ...rowToRecalculate, totalPrice: rowToRecalculate.price * rowToRecalculate.amount };
    }
  }
}

export interface RecalculationRow extends ItemModel {
  changedField: string;
}
