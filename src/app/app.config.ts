<<<<<<< Updated upstream
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
=======
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
>>>>>>> Stashed changes

import { routes } from './app.routes';
import { authInterceptor } from './services/auth-interceptor';

//import { authInterceptor } from './auth.intercepter';


export const appConfig: ApplicationConfig = {

  providers: [

<<<<<<< Updated upstream
=======
    provideBrowserGlobalErrorListeners(),

>>>>>>> Stashed changes
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
<<<<<<< Updated upstream
        authInterceptor
=======
        //authInterceptor
>>>>>>> Stashed changes
      ])
    )

  ]

};