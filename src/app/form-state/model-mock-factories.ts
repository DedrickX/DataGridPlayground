import { DocumentModel, ItemModel } from './model';

export function getEmptyDocument(): DocumentModel {
  return {
    documentNumber: '',
    items: []
  }
}

export function getEmptyItem(id: number): ItemModel {
  return {
    id,
    name: '',
    price: 0,
    amount: 1,
    totalPrice: 0,
    description: ''
  }
}

export function getMockDocument(): DocumentModel {
  return {
    documentNumber: '2023-01',
    items: [
      {
        id: 1,
        name: 'item 1',
        price: 500,
        amount: 1,
        totalPrice: 500,
        description: 'Item 1 description'
      },
      {
        id: 2,
        name: 'item 2',
        price: 20,
        amount: 2,
        totalPrice: 40,
        description: 'Item 2 description'
      }
    ]
  }
}

