import { inject } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';

// import {  } from "module";

export const authGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem('token');
  let _router = inject(Router);
  if(token===null){
    _router.navigate(['/auth/login'],{
      queryParams:{
        'returnurl':state.url
      }
    });
    return false;
  }
  return true;
};
