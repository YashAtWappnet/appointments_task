import { createAction, props } from '@ngrx/store';
import { User } from './user.state';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{
    name: string;
    email: string;
    password: string;
    role: 'patient' | 'doctor';
  }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ email: string; password: string }>()
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');
