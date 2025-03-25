import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as UserActions from '../store/user.actions';
import { UserState } from '../store/user.state';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private store: Store<{ user: UserState }>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('access_token');
          this.store.dispatch(UserActions.logout());
        }
        return throwError(() => error);
      })
    );
  }
}
