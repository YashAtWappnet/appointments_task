import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { userReducer } from './store/user.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './store/user.effects';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AppointmentEffects } from './store/appointment.effects';
import { appointmentReducer } from './store/appointment.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      user: userReducer,
      appointments: appointmentReducer,
    }),
    provideEffects([UserEffects, AppointmentEffects]),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi()
    ), // For functional interceptors

    {
      provide: ErrorInterceptor,
      useClass: ErrorInterceptor,
    },
  ],
};
