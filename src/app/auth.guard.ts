/*
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  // Get JWT token from sessionStorage
  const token = sessionStorage.getItem('token');

  // Token exists → allow access
  if (token) {
    return true;
  }

  // Token doesn't exist → go to login
  return router.createUrlTree(['/login']);
};
*/