import { createReducer, on } from '@ngrx/store';
import { initialUserState, UserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.login, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(UserActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.registerSuccess, (state) => ({ ...state, loading: false })),
  on(UserActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.logout, (state) => initialUserState)
);
