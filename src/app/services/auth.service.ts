
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/Auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        // Save login response
        localStorage.setItem('authUser', JSON.stringify(response));

        // Save JWT token separately
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('authUser');

    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
  }
}
