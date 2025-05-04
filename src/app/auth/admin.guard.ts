import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('loggedUser') || 'null');

  if (!user || user.rol?.toLowerCase() !== 'admin') {
    router.navigate(['/home'], { queryParams: { msg: 'not-authorized' } });
    return false;
  }

  return true;
};
