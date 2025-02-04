import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BASE_URL } from '../../shared/constants/constants';
import { AccountsResponse } from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private httpClient: HttpClient) {}

  deposit(accountId: string, amount: number): Observable<AccountsResponse> {
    return this.httpClient.post<AccountsResponse>(
      `${BASE_URL}/account/${accountId}/deposit`,
      {
        amount,
      }
    );
  }

  withdraw(accountId: string, amount: number): Observable<AccountsResponse> {
    return this.httpClient.post<AccountsResponse>(
      `${BASE_URL}/account/${accountId}/withdraw`,
      {
        amount,
      }
    );
  }

  transfer(
    accountId: string,
    amount: number,
    targetAccountNumber: string
  ): Observable<AccountsResponse> {
    return this.httpClient.post<AccountsResponse>(
      `${BASE_URL}/account/${accountId}/transfer`,
      {
        amount,
        targetAccountNumber,
      }
    );
  }
}
