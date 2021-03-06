import {Injectable} from '@angular/core';
import {AuthRequest} from '../dtos/auth-request';
import {interval, Observable, throwError } from 'rxjs';
import {AuthResponse} from '../dtos/auth-response';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {tap, map, catchError} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import {Globals} from '../global/globals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authBaseUri: string = this.globals.backendUri + '/authentication';
  private authScheduler: Observable<any> = interval(1000);
  error: boolean = false;
  errorMessage: string = '';

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.scheduleReAuthentication();
  }

  /**
   * Login of the user. If it was successful, a valid JWT token will be stored
   * @param authRequest User data
   */
  loginUser(authRequest: AuthRequest): Observable<AuthResponse> {
    console.log('Log in');
    return this.httpClient.post<AuthResponse>(this.authBaseUri, authRequest)
      .pipe(catchError(this.handleError))
      .pipe(
        tap((authResponse: AuthResponse) => this.setToken(authResponse))
      );
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `${error.error}`;
    }
    return throwError(errorMessage);
  }


  /**
   * Check if a valid JWT token is saved in the localStorage
   */
  isLoggedIn() {
    return !!this.getToken() && (this.getTokenExpirationDate(this.getToken()).valueOf() > new Date().valueOf());
  }

  /**
   * Logout of the user. If it was successful, a valid JWT token will be removed
   */
  logoutUser() {
    console.log('Log out');
    localStorage.removeItem('currentToken');
    localStorage.removeItem('futureToken');
    localStorage.removeItem('currentUser');
  }

  getToken() {
    return localStorage.getItem('currentToken');
  }

  getFutureToken() {
    return localStorage.getItem('futureToken');
  }

  private setToken(authResponse: AuthResponse) {
    localStorage.setItem('currentToken', authResponse.currentToken);
    localStorage.setItem('futureToken', authResponse.futureToken);
  }

  setUsername(username: string) {
    localStorage.setItem('currentUser', username);
  }

  getUsername() {
    return localStorage.getItem('currentUser');
  }

  /**
   * JWT token expires after 10 minutes, therefore a new token will requested 1 minute before the expiration
   */
  private scheduleReAuthentication() {
    this.authScheduler.subscribe(() => {
      if (this.isLoggedIn()) {
        const timeLeft = this.getTokenExpirationDate(this.getToken()).valueOf() - new Date().valueOf();
        if ((timeLeft / 1000) < 60) {
          this.reAuthenticate().subscribe(
            () => {
              console.log('Re-authenticated successfully');
            },
            error => {
              console.log('Could not re-authenticate ' + error);
            });
        }
      }
    });
  }

  /**
   * Use futureToken as new token and request a new futureToken
   */
  private reAuthenticate(): Observable<AuthResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.getFutureToken()
      })
    };
    return this.httpClient.get<AuthResponse>(this.authBaseUri, httpOptions)
      .pipe(
        tap((authResponse: AuthResponse) => this.setToken(authResponse))
      );
  }

  private getTokenExpirationDate(token: string): Date {

    const decoded: any = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

}
