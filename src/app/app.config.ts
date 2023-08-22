import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponentEffects } from './form-state/app-component-effects';
import { documentReducer } from './form-state/state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      'document': documentReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([
      AppComponentEffects
    ])
  ]
};
