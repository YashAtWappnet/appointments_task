import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserActions from './user.actions';
import { UserRole } from './user.state';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      switchMap(({ email, password }) =>
        this.http
          .post<{
            access_token: string;
            user: { id: number; name: string; email: string; role: string };
          }>('http://localhost:3000/users/login', { email, password })
          .pipe(
            map((response) => {
              localStorage.setItem('access_token', response.access_token);
              const user = {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: response.user.role as UserRole,
              };
              return UserActions.loginSuccess({ user });
            }),
            catchError((error) =>
              of(
                UserActions.loginFailure({
                  error: error.message || 'Login failed',
                })
              )
            )
          )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.register),
      switchMap(({ name, email, password, role }) =>
        this.http
          .post<{ message: string }>('http://localhost:3000/users/register', {
            name,
            email,
            password,
            role,
          })
          .pipe(
            map((response) => {
              console.log('response', response);
              if (response.message === 'User registered successfully') {
                return UserActions.registerSuccess({ email, password });
              }
              throw new Error('Unexpected response');
            }),
            catchError((error) =>
              of(
                UserActions.registerFailure({
                  error: error.message || 'Registration failed',
                })
              )
            )
          )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.registerSuccess),
      map(({ email, password }) => UserActions.login({ email, password }))
    )
  );
}
