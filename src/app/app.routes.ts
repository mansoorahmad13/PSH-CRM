import { Routes } from '@angular/router';
import { Login } from './login/login';
import { guestGuard } from './auth/guest-guard';
import { routes as donationRoutes } from './dashboard/donations/donations.routes';
import { Shell } from './shell/shell';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login, canMatch: [guestGuard], title: 'Login · Pakistan Sweet Home CRM' },
  {
    path: '',
    component: Shell,
    canMatch: [authGuard],
    children: [
      { path: '', redirectTo: 'donations/incomplete', pathMatch: 'full' },
      { path: 'donations', children: donationRoutes },
    ],
  },
  { path: '**', redirectTo: '' },
];

