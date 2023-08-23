import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { createFormGroupState, FormGroupState, formStateReducer, onNgrxForms, SetValueAction } from 'ngrx-forms';
import { appComponentActions } from './app-component-actions';
import { DocumentModel, ItemModel } from './model';
import { getEmptyDocument } from './model-mock-factories';
import { recalculateActions } from './recalculate-actions';
import { RecalculationRow } from '../recalculate-api-service/recalculate-api.service';

export const FORM_ID = 'DocumentForm';

// ------------------ FORM STATE ------------------
export interface DocumentFormState {
  loadInProgress: boolean;
  recalculateInProgress: boolean;
  documentFormState: FormGroupState<DocumentModel>;
}

export const initialFormGroupState = createFormGroupState<DocumentModel>(FORM_ID, getEmptyDocument());

const initialState: DocumentFormState = {
  loadInProgress: false,
  recalculateInProgress: false,
  documentFormState: initialFormGroupState,
}

// ------------------ REDUCERS ------------------
export const documentReducer = createReducer(

  initialState,
  onNgrxForms(),


  // ------ app component reducers ------
  on(
    appComponentActions.loadDocumentById, appComponentActions.loadEmptyDocument,
    state => ({
      ...state,
      loadInProgress: true,
    })
  ),

  on(
    appComponentActions.loadDocumentSuccess,
    (state, action) => ({
      ...state,
      loadInProgress: false,
      documentFormState: createFormGroupState<DocumentModel>(FORM_ID, action.document),
    }),
  ),

  // ------ recalculate reducers ------

  on(
    recalculateActions.setRecalculationProgress,
    (state, action) => ({
      ...state,
      recalculateInProgress: action.inProgress,
  })),

  on(
    recalculateActions.recalculateRowsResult,
    (state, action) => {
      const recalculatedItemsAndIndexes = action.recalculatedRows.map(row => ({
        index: row.changedField.match(/\d+/)[0],
        item: row,
      }));
      const newItems = state.documentFormState.controls.items.value.map((itemInStore, index) => {
        const recalculatedItem = recalculatedItemsAndIndexes.find(i => i.index === index.toString());
        return recalculatedItem
          ? mergeRecalculatedValuesToStoreItem(itemInStore, recalculatedItem.item)
          : itemInStore;
      });
      // we create new state using old one and setting value to items ArrayControlState
      return {
        ...state,
        documentFormState: formStateReducer(
          state.documentFormState,
          new SetValueAction( FORM_ID + '.items', newItems)
        )
      };
    }
  ),
);

function mergeRecalculatedValuesToStoreItem(itemInStore: ItemModel, recalculatedItem: RecalculationRow): ItemModel {
  return {
    ...itemInStore,
    price: recalculatedItem.changedField.endsWith('price') ? itemInStore.price : recalculatedItem.price,
    amount: recalculatedItem.changedField.endsWith('amount') ? itemInStore.amount : recalculatedItem.amount,
    totalPrice: recalculatedItem.changedField.endsWith('totalPrice') ? itemInStore.totalPrice : recalculatedItem.totalPrice,
  };
}

// ------------------ SELECTORS ------------------
export const documentFeatureSelector = createFeatureSelector<DocumentFormState>('document');
export const documentFormStateSelector = createSelector(documentFeatureSelector, s => s.documentFormState);

export const loadInProgressSelector = createSelector(documentFeatureSelector, s => s.loadInProgress);
export const recalculateInProgressSelector = createSelector(documentFeatureSelector, s => s.recalculateInProgress);
export const itemsFormStateSelector = createSelector(documentFormStateSelector, s => s.controls.items);
export const itemsValueSelector = createSelector(itemsFormStateSelector, s => s.value);
