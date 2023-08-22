export interface DocumentModel {
  documentNumber: string;
  items: ItemModel[];
}

export interface ItemModel {
  id: number;
  name: string;
  price: number;
  amount: number;
  totalPrice: number;
  description: string;
}
