import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient) {}

  /* Calculate the expiration time stamp correctly (Expireat) and save everything in localstorage */
  saveTokens(
    idToken: string,
    refreshToken: string,
    expiresInSecs: number
  ): void {
    //convert in milliseconds - result is the real istant
    const expireAt = Date.now() + expiresInSecs * 1000;

    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expireAt', expireAt.toString());

    console.log('Token saved in local storage');
  }

  // if token is stored return idToken, else return NULL
  getAccessToken(): string | null {
    return localStorage.getItem('idToken');
  }
  // if refreshToken is stored return refreshToken, else return NULL
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // if expireAt is stored return expireAt, else return NULL
  getTokenExpiration(): number | null {
    const exp = localStorage.getItem('expireAt');
    return exp ? Number(exp) : null;
  }

  /* return true if the time is expire else false
   you can use offsetMs for setting a margin of time in milliseconds 
 */
  isTokenExpired(offsetMs: number = 0): boolean {
    const exp = this.getTokenExpiration();
    return !exp || Date.now() >= exp - offsetMs;
  }

  //clear localStorage- ex: logout
  clear(): void {
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expireAt');
  }
}
