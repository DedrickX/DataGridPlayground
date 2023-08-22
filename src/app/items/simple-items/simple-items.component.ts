import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxNumberBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { FormArrayState, FormGroupState, NgrxFormsModule } from 'ngrx-forms';
import { ItemModel } from '../../form-state/model';

@Component({
  selector: 'app-simple-items',
  standalone: true,
  imports: [
    CommonModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    NgrxFormsModule,
  ],
  templateUrl: './simple-items.component.html',
  styleUrls: ['./simple-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleItemsComponent {

  @Input() formState: FormArrayState<ItemModel>;

  protected itemIdentity(index: number, item: FormGroupState<ItemModel>): any {
    return item.id;
  }
}
