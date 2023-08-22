import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DocumentModel } from './model';

export const appComponentActions = createActionGroup({
  source: 'AppComponent',
  events: {
    LoadEmptyDocument: emptyProps(),
    LoadDocumentById: props<{ id: number }>(),
    LoadDocumentSuccess: props<{document: DocumentModel }>(),
  }
});
