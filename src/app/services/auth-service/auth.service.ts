import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginResponse } from '../../models/auth.models';
import { User, NewUserDetails, UserResponse } from '../../models/user.models';
import { Role } from '../../models/models';
import { BASE_URL } from '../../shared/constants/constants';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = signal<User | null>(null);
  loggedIn$ = signal<boolean>(this.hasValidToken());
  role$ = signal<Role>(Role.user);
  forgotPasswordusername$ = signal<string>('');

  constructor(private httpClient: HttpClient) {
    if (this.loggedIn$()) {
      // this.fetchAndStoreUserDetails();
    }
  }

  hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${BASE_URL}/auth/login`, {
      username: username,
      password: password,
    });
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}
