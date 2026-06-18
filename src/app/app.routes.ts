import { Routes } from '@angular/router';
import { Login } from './login/login';
import { guestGuard } from './auth/guest-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canMatch: [guestGuard],
        title: 'Login · Pakistan Sweet Home CRM'
    }
];
