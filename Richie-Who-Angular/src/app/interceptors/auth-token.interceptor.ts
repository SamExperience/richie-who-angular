import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

/* 
  We use AuthTokeenTerceptor as a filter between client and backend, 
  to insert the token in the header at each call. 
  If the token has expired then a new one will be requested
 */

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken(); //recovery the saved token

  if (!token || tokenService.isTokenExpired()) {
    //missing token or expire -> send request
    return next(req);
  }

  const authReq =
    token && !tokenService.isTokenExpired()
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        })
      : req;

  /* 
      we cant edit the original request because HttpHeaders return a new obj each time you use set()
      solution: clone the original request and set the new header Authorization with the effective token
   */
  const cloneReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(cloneReq);
};
