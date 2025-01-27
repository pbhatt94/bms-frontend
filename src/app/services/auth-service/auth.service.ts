import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginResponse } from '../../models/auth.models';
import { User, NewUserDetails, UserResponse } from '../../models/user.models';
import { Role } from '../../models/models';
import { BASE_URL } from '../../shared/constants/constants';

import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = signal<string | null>(null);
  loggedIn$ = signal<boolean>(this.hasValidToken());
  role$ = signal<Role>(Role.user);
  currentUser = signal<User | null>(null);

  constructor(private httpClient: HttpClient) {
    if (this.loggedIn$()) {
      this.fetchAndStoreUserDetails();
    }
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   this.fetchAndStoreUserDetails();
    //   const decodedToken: {
    //     sub: string;
    //     role: string;
    //     exp: number;
    //   } = jwtDecode(token);
    //   console.log(decodedToken);
    //   this.role$.set(
    //     decodedToken.role === 'ROLE_ADMIN' ? Role.admin : Role.user
    //   );
    //   this.user$.set(decodedToken.sub);
    // }
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

  fetchAndStoreUserDetails() {
    this.httpClient.get<UserResponse>(`${BASE_URL}/user/me`).subscribe({
      next: (response: UserResponse) => {
        this.loggedIn$.set(true);
        this.currentUser.set(response?.data);
        this.role$.set(response?.data?.role);
        console.log(this.loggedIn$(), this.currentUser(), this.role$());
      },
    });
  }

  isAdmin() {
    return this.role$() === Role.admin;
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}
