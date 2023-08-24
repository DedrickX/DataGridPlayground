export interface DocumentModel {
  documentNumber: string;
  items: ItemModel[];
  finalDocumentText: string;
}

export interface ItemModel {
  id: number;
  ordinal: number;
  name: string;
  price: number;
  amount: number;
  totalPrice: number;
  description: string;
}

export interface GridItemModel extends ItemModel {
  __storeIndex: number;
}
