import { DocumentModel, ItemModel } from './model';

export function getEmptyDocument(): DocumentModel {
  return {
    documentNumber: '',
    finalDocumentText: '',
    items: []
  }
}

export function getEmptyItem(id: number, ordinal: number): ItemModel {
  return {
    id,
    ordinal,
    name: '',
    price: 0,
    amount: 1,
    totalPrice: 0,
    description: ''
  }
}

export function getMockDocument(id: number): DocumentModel {
  switch (id) {
    case 1:
      return {
        documentNumber: '2023-01',
        finalDocumentText: 'This is a mock document 1',
        items: [
          {
            id: 1,
            ordinal: 1,
            name: 'item 1',
            price: 500,
            amount: 1,
            totalPrice: 500,
            description: 'Item 1 description'
          },
          {
            id: 2,
            ordinal: 2,
            name: 'item 2',
            price: 20,
            amount: 2,
            totalPrice: 40,
            description: 'Item 2 description'
          },
          {
            id: 3,
            ordinal: 3,
            name: 'item 3',
            price: 15.5,
            amount: 4,
            totalPrice: 62,
            description: 'Item 3 description'
          },
          {
            id: 4,
            ordinal: 4,
            name: 'item 4',
            price: 100,
            amount: 1,
            totalPrice: 100,
            description: 'Item 4 description'
          }
        ]
      }

    case 2:
      const numbers = Array.from(Array(100).keys());
      return {
        documentNumber: '2023-02',
        finalDocumentText: 'This is a mock document 2',
        items: numbers.map<ItemModel>((_, index) => ({
          id: index + 1,
          ordinal: index + 1,
          name: `item ${index + 1}`,
          price: index + 1,
          amount: 1,
          totalPrice: index + 1,
          description: `Item ${index + 1} description`
        }))
      }

    default:
      throw new Error(`Unknown document id: ${id}`);
  }

}

