import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    //login ok, go to new route
    console.log('Auth ok');
    return true;
  } else {
    //login NOT ok
    console.log('Auth NOT ok, redirect to login page');
    return router.createUrlTree(['admin-login']);
  }
};
