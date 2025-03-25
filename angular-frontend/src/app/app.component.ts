import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState, User } from './store/user.state';
import * as UserActions from './store/user.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  user$: Observable<User | null>;

  constructor(private store: Store<{ user: UserState }>) {
    this.user$ = this.store.select((state) => state.user.user);
  }

  logout() {
    localStorage.removeItem('access_token'); // Clear token
    this.store.dispatch(UserActions.logout());
  }
}
