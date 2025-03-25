import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Homepage at "/"
  { path: 'auth', component: AuthComponent }, // Auth page at "/auth"
  { path: 'dashboard', component: DashboardComponent }, // Dashboard at "/dashboard"
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard redirects to homepage
];
