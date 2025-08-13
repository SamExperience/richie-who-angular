import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

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
    //convert seconds to milliseconds - result is the real istant
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

  refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();

    //If the token does not exist (ex: the user is not logged in), we cannot do anything
    if (!refreshToken) return Promise.resolve(null);

    const body = new URLSearchParams(); //Codified string in X-Www-form-Urlencoded for Firebase
    body.set('grant_type', 'refresh_token'); //Indicates to Firebase that we are using the refresh token
    body.set('refresh_token', refreshToken); //We pass the true token to generate a new token

    return firstValueFrom(
      this.http.post<any>(
        `https://securetoken.googleapis.com/v1/token?key=${environment.firebaseConfig.apiKey}`,
        body.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
    )
      .then((res) => {
        //save new token
        this.saveTokens(
          res.id_token,
          res.refresh_token,
          Number(res.expires_in)
        );
        return res.id_token;
      })
      .catch((err) => {
        console.error('refresh token failed', err);
        this.clear(); //if fail, delete the token
        return null;
      });
  }
}
