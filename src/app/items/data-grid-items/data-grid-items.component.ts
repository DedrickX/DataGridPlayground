import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { DxDataGridModule } from 'devextreme-angular';
import { EditorPreparedEvent } from 'devextreme/ui/data_grid';
import { FormArrayState, SetValueAction } from 'ngrx-forms';
import { GridItemModel, ItemModel } from '../../form-state/model';
import { FORM_ID } from '../../form-state/state';

import TextBox from "devextreme/ui/text_box";
import NumberBox from "devextreme/ui/number_box";


@Component({
  selector: 'app-data-grid-items',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule
  ],
  templateUrl: './data-grid-items.component.html',
  styleUrls: ['./data-grid-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridItemsComponent implements OnChanges {

  @Input() formState: FormArrayState<ItemModel>;

  protected gridItems: GridItemModel[] = [];

  currentColumn: string;
  currentKey: any;
  editorValue: any;
  activeEditor: any;

  constructor(
    private store: Store,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formState']) {
      const currentChanges: FormArrayState<ItemModel> = changes['formState'].currentValue;

      this.gridItems = currentChanges.value
        .map((item, index) => ({
          __storeIndex: index,
          ...item
        }));

      if (this.gridItems.length > 0 && this.editorValue) {
        const newValue = this.gridItems.find(i => i.__storeIndex === this.currentKey)[this.currentColumn]
        if (newValue != this.editorValue) {
          this.activeEditor.option("value", newValue);
        }
      }
    }
  }

  rowUpdating(e: any): void {
    if (e && e.newData) {
      const changedProperty = Object.keys(e.newData)[0];
      const value = e.newData[changedProperty];
      const action = new SetValueAction(`${FORM_ID}.items.${e.key}.${changedProperty}`, value);
      this.store.dispatch(action);
    }
  }

  editorPrepared(e: EditorPreparedEvent) {
    this.currentKey = e.row.key;
    this.currentColumn = e.dataField;
    this.editorValue = e.value;
    this.activeEditor = TextBox.getInstance(e.editorElement);
    if (!this.activeEditor)
      this.activeEditor = NumberBox.getInstance(e.editorElement);
  }

}
