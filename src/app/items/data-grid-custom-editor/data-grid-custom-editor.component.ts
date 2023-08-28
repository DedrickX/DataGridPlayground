import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  DxBoxModule,
  DxButtonModule,
  DxDataGridModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxTextBoxModule
} from 'devextreme-angular';
import dxDataGrid, { KeyDownEvent } from "devextreme/ui/data_grid"
import { FormArrayState, FormGroupState, NgrxFormsModule } from 'ngrx-forms';
import { BehaviorSubject } from 'rxjs';
import { GridItemModel, ItemModel } from '../../form-state/model';

@Component({
  selector: 'app-data-grid-custom-editor',
  standalone: true,
  imports: [
    CommonModule,
    NgrxFormsModule,
    DxDataGridModule,
    DxPopupModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxBoxModule,
    DxButtonModule,
  ],
  templateUrl: './data-grid-custom-editor.component.html',
  styleUrls: ['./data-grid-custom-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridCustomEditorComponent implements OnChanges {

  @Input() formState: FormArrayState<ItemModel>;

  protected gridComponent: dxDataGrid | null = null;
  protected gridItems: GridItemModel[] = [];

  protected focusedRowKey: number | null = null;
  protected editorVisible = false;
  protected focusedRowState$ = new BehaviorSubject<FormGroupState<ItemModel | null>>(null);

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
    }
    this.updateFocusedRowState();
  }

  onInitialized($event: any) {
    this.gridComponent = $event.component;
  }

  onFocusedRowKeyChange(e: number) {
    this.focusedRowKey = e;
    this.updateFocusedRowState();
  }

  onCellDblClick(e: any) {
    this.tryToShowEditor();
  }

  onKeyDown($event: KeyDownEvent) {
    if ($event.event.key === 'Enter') {
      this.tryToShowEditor();
    }
  }

  tryToShowEditor() {
    if (this.focusedRowKey === null) {
      return;
    }
    this.editorVisible = true;
  }
  updateFocusedRowState(): void {
    if (this.focusedRowKey === null) {
      this.focusedRowState$.next(null);
      return;
    }
    this.focusedRowState$.next(this.formState.controls[this.focusedRowKey] as FormGroupState<ItemModel>);
  }

  onEditorHidden() {
    this.gridComponent?.focus();
  }

  onEditorShown(e: any) {
    console.log('>>> onEditorShown', e);
    e.component?.focus();
  }
}
