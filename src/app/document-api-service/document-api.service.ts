import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { DocumentModel } from '../form-state/model';
import { getEmptyDocument, getMockDocument } from '../form-state/model-mock-factories';

const MOCK_API_DELAY_MS = 500;

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService {

  constructor() { }

  public loadEmptyDocument(): Observable<DocumentModel> {
    return of(getEmptyDocument()).pipe(
      delay(MOCK_API_DELAY_MS),
    )
  }

  public loadDocumentById(id: number): Observable<DocumentModel> {
    return of(getMockDocument(id)).pipe(
      delay(MOCK_API_DELAY_MS),
    );
  }
}
