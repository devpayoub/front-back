import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EMPTY, from, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
// import { from, map } from 'rxjs';
import { User } from '../../store/Authentication/auth.models';
//import { getFirebaseBackend } from '../../authUtils';
// import { getFirebaseBackend } from '../../authUtils';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private apiUrl = 'http://localhost:8080/api/auth';
    email: string = '';
  errorMessage: string ="";

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message || 'Login failed.'));
      })
    );
  }

  register(email: string, username: string, password: string, role: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, username, password, role }).pipe(
      tap((response: any) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/account-login']); // Redirect to login page
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred during registration:', error); // Log the full error
        return throwError(() => new Error(error.error?.message || 'Registration failed.'));
      })
    );
  }
  
  currentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) as User : null;
  }
  

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth-login']);
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, from } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { User } from '../../store/Authentication/auth.models'; // Assurez-vous que ce modèle existe et est bien importé

// @Injectable({ providedIn: 'root' })
// export class AuthenticationService {
//   [x: string]: any;

//   private apiUrl = 'http://localhost:8081/users'; // Remplacez par l'URL de votre backend
//   private tokenKey = 'authToken'; // Clé pour stocker le token dans localStorage

//   constructor(private http: HttpClient) {}

//   /**
//    * Returns the current user from local storage
//    */
//   public currentUser(): User | null {
//     const token = localStorage.getItem(this.tokenKey);
//     return token ? { token } as User : null;
//   }

//   /**
//    * Performs the auth
//    * @param email email of user
//    * @param password password of user
//    */
//   login(email: string, password: string): Observable<User> {
//     return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
//       .pipe(
//         map(response => {
//           if (response && response.token) {
//             // Store token in localStorage
//             localStorage.setItem(this.tokenKey, response.token);
//             return { token: response.token } as User;
//           }
//           throw new Error('Authentication failed');
//         })
//       );
//   }

//   /**
//    * Performs the register
//    * @param email email
//    * @param username username
//    * @param password password
//    */
//   register(email: string, username: string, password: string): Observable<User> {
//     return this.http.post<any>(`${this.apiUrl}/register`, { email, username, password })
//       .pipe(
//         map(response => {
//           if (response && response.token) {
//             // Store token in localStorage
//             localStorage.setItem(this.tokenKey, response.token);
//             return { token: response.token } as User;
//           }
//           throw new Error('Registration failed');
//         })
//       );
//   }

//   /**
//    * Reset password
//    * @param email email
//    */
//   resetPassword(email: string): Observable<string> {
//     return this.http.post<any>(`${this.apiUrl}/reset-password`, { email })
//       .pipe(
//         map(response => response.message || 'Password reset email sent')
//       );
//   }

//   /**
//    * Logout the user
//    */
//   logout() {
//     // Remove token from localStorage
//     localStorage.removeItem(this.tokenKey);
//   }
// }


