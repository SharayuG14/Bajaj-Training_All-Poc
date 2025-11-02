import { inject } from "@angular/core";
import { CanActivateFn , Router} from '@angular/router';

export const hrGuard: CanActivateFn = (route, state) => {
  let role=localStorage.getItem('role');
  let _router= inject(Router);
  if (role!=='Hr') {
    _router.navigate(['/forbidden-access']);
    return false;
  }
  return true;
};
