import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { Auth } from './auth';

export const guestGuard: CanMatchFn = (route, segments) => {
  const authService = inject(Auth)
  const router = inject(Router)
  const isLoggedIn = authService.checkIfLoggedIn()
  
  return !isLoggedIn ? true : new RedirectCommand(router.parseUrl('/'))
};
