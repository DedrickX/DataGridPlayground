import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import {
  DxiColumnModule,
  DxiItemModule,
  DxoEditingModule,
  DxoFormModule,
  DxoPagingModule
} from 'devextreme-angular/ui/nested';
import { FormArrayState, SetValueAction } from 'ngrx-forms';
import { GridItemModel, ItemModel } from '../../form-state/model';
import { FORM_ID } from '../../form-state/state';
import { RecalculateApiService } from '../../recalculate-api-service/recalculate-api.service';

@Component({
  selector: 'app-data-grid-internal-recalc-items',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxiColumnModule,
    DxiItemModule,
    DxoEditingModule,
    DxoFormModule,
    DxoPagingModule,
    DxSelectBoxModule,
  ],
  templateUrl: './data-grid-internal-recalc-items.component.html',
  styleUrls: ['./data-grid-internal-recalc-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridInternalRecalcItemsComponent implements OnChanges {

  @Input() formState: FormArrayState<ItemModel>;

  protected gridItems: GridItemModel[] = [];

  protected gridEditingMode = 'row';

  constructor(
    private store: Store,
    private recalculateApiService: RecalculateApiService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formState']) {
      const currentChanges: FormArrayState<ItemModel> = changes['formState'].currentValue;

      this.gridItems = currentChanges.value
        .map((item, index) => ({
          __storeIndex: index,
          ...item
        }));
    }
  }

  rowUpdating(e: any): void {
    console.log('>>> rowUpdating', e)
  }

  rowUpdated(e: any) {
    console.log('>>> rowUpdated', e)
    const { __storeIndex, ...data } = e.data;
    const action = new SetValueAction(`${FORM_ID}.items.${__storeIndex}`, data);
    this.store.dispatch(action);
  }

  setUnitPriceCellValue = async (newData: any, value: number, currentRowData: GridItemModel): Promise<any> => {
    const result = await this.recalculateApiService.recalculateRowAsync({
      ...currentRowData,
      price: value,
      changedField: 'price',
    });
    newData.price= value;
    newData.totalPrice = result.totalPrice;
    return newData
  }

  setAmountCellValue = async (newData: any, value: number, currentRowData: GridItemModel): Promise<any> => {
    const result = await this.recalculateApiService.recalculateRowAsync({
      ...currentRowData,
      amount: value,
      changedField: 'amount',
    });
    newData.amount = value;
    newData.totalPrice = result.totalPrice;
    return newData;
  }

  setTotalPriceCellValue = async (newData: any, value: number, currentRowData: GridItemModel): Promise<any> => {
    const result = await this.recalculateApiService.recalculateRowAsync({
      ...currentRowData,
      totalPrice: value,
      changedField: 'totalPrice',
    });
    newData.totalPrice = value;
    newData.price = result.price;
    return newData;
  }
}
