import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { DocumentApiService } from '../document-api-service/document-api.service';
import { appComponentActions } from './app-component-actions';

@Injectable()
export class AppComponentEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private documentApiService: DocumentApiService,
  ) {
  }

  loadEmptyDocument$ = createEffect(() => this.actions$.pipe(
    ofType(appComponentActions.loadEmptyDocument),
    switchMap(() => this.documentApiService.loadEmptyDocument().pipe(
        map(document => appComponentActions.loadDocumentSuccess({ document })
      )
    ),
  )));

  loadDocumentById$ = createEffect(() => this.actions$.pipe(
    ofType(appComponentActions.loadDocumentById),
    switchMap(action => this.documentApiService.loadDocumentById(action.id).pipe(
        map(document => appComponentActions.loadDocumentSuccess({ document })
      )
    ),
  )));
}
