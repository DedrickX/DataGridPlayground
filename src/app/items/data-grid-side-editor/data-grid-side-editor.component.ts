import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  DxBoxModule,
  DxButtonModule,
  DxDataGridModule,
  DxNumberBoxModule,
  DxPopupModule, DxTextBoxComponent,
  DxTextBoxModule
} from 'devextreme-angular';
import { DxiColumnModule, DxoPagingModule } from 'devextreme-angular/ui/nested';
import dxDataGrid, { KeyDownEvent } from 'devextreme/ui/data_grid';
import { FormArrayState, FormGroupState, NgrxFormsModule } from 'ngrx-forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { GridItemModel, ItemModel } from '../../form-state/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgrxFormsModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxiColumnModule,
    DxoPagingModule,
    DxButtonModule,
    DxBoxModule,
  ],
  selector: 'app-data-grid-side-editor',
  standalone: true,
  styleUrls: ['./data-grid-side-editor.component.scss'],
  templateUrl: './data-grid-side-editor.component.html',
})
export class DataGridSideEditorComponent implements OnChanges {

  @Input() formState: FormArrayState<ItemModel>;

  protected gridComponent: dxDataGrid | null = null;
  protected gridItems: GridItemModel[] = [];

  protected editorVisible$ = new BehaviorSubject<boolean>(false);
  protected focusedRowState$ = new BehaviorSubject<FormGroupState<ItemModel | null>>(null);
  protected focusedRowKey$ = new BehaviorSubject<number | null>(null);

  @ViewChild('firstEditor', { static: false }) firstEditorTextBox: DxTextBoxComponent | null = null;

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
  }

  get viewModel$(): Observable<ViewModel> {
    return combineLatest(
      [this.editorVisible$, this.focusedRowState$, this.focusedRowKey$],
      (sideEditorVisible, focusedRow, focusedRowKey) => ({
        sideEditorVisible,
        focusedRow,
        focusedRowKey,
      })
    );
  }

  onInitialized($event: any) {
    this.gridComponent = $event.component;
  }

  onFocusedRowKeyChange(e: number) {
    this.focusedRowKey$.next(e);
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
    if (this.focusedRowKey$.value === null) {
      return;
    }
    this.editorVisible$.next(true);
    this.updateFocusedRowState();
  }

  hideEditor() {
    this.editorVisible$.next(false);
    // this.gridComponent.focus();
  }

  updateFocusedRowState(): void {
    if (this.focusedRowKey$.value === null) {
      this.focusedRowState$.next(null);
      return;
    }
    this.focusedRowState$.next(this.formState.controls[this.focusedRowKey$.value] as FormGroupState<ItemModel>);
  }

  async goto(movement: number): Promise<void> {
    if (this.focusedRowKey$.value === null) {
      return;
    }
    const nextIndex = this.gridComponent.getRowIndexByKey(this.focusedRowKey$.value) + movement;
    console.log('>>> nextIndex', nextIndex);
    const nextRowKey = this.gridComponent.getKeyByRowIndex(nextIndex);
    if (nextRowKey !== undefined) {
      this.focusedRowKey$.next(nextRowKey);
      this.updateFocusedRowState();
      this.firstEditorTextBox?.instance.focus();
    }
  }

  onEditorKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.hideEditor();
    }
  }
}

interface ViewModel {
  sideEditorVisible: boolean;
  focusedRow: FormGroupState<ItemModel | null>;
  focusedRowKey: number | null;
}
