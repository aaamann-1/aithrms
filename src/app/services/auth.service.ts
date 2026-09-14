import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
<<<<<<< Updated upstream
  private apiUrl = '/api/Auth';

  constructor(private http: HttpClient) {}

=======
  private apiUrl = 'http://localhost:5089/api/auth';
  // Replace 7044 with the HTTPS port shown by `dotnet run`

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

>>>>>>> Stashed changes
  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}