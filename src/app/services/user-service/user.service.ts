import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  AddUserResponse,
  NewUserDetails,
  UpdateUserDetails,
  User,
  UserResponse,
  UsersResponse,
} from '../../models/user.models';
import { BASE_URL } from '../../shared/constants/constants';

import { Observable, tap } from 'rxjs';
import { ResponseType } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getAllUsers(
    offset: number = 0,
    limit: number = 100
  ): Observable<UsersResponse> {
    return this.httpClient.get<UsersResponse>(
      `${BASE_URL}/users?size=${limit}&page=${offset}`
    );
  }

  getProfile(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${BASE_URL}/users/me`);
  }

  addUser(userDetails: NewUserDetails): Observable<AddUserResponse> {
    return this.httpClient.post<AddUserResponse>(
      `${BASE_URL}/auth/register`,
      userDetails
    );
  }

  deleteUser(userId: string): Observable<{
    status: ResponseType;
    message: string;
  }> {
    return this.httpClient.delete<{
      status: ResponseType;
      message: string;
    }>(`${BASE_URL}/user/${userId}`);
  }

  updateUser(userId: string, user: UpdateUserDetails) {
    return this.httpClient.put(`${BASE_URL}/user/${userId}`, user, {
      observe: 'response',
    });
  }
}
