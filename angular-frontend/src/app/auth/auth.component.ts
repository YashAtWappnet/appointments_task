import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserState } from '../store/user.state';
import * as UserActions from '../store/user.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  activeTab: 'login' | 'register' = 'login';
  showPassword = false;
  showConfirmPassword = false;

  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ user: UserState }>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['patient', Validators.required],
    });

    this.error$ = this.store.select((state) => state.user.error);
  }

  toggleTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  togglePassword(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(UserActions.login({ email, password }));
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { name, email, password, confirmPassword, role } =
        this.registerForm.value;
      if (password !== confirmPassword) {
        this.store.dispatch(
          UserActions.registerFailure({ error: 'Passwords do not match' })
        );
        return;
      }
      this.store.dispatch(
        UserActions.register({ name, email, password, role })
      );
    }
  }
}
