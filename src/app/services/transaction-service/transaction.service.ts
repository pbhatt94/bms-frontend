import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BASE_URL } from '../../shared/constants/constants';
import {
  DownloadURLResponse,
  TransactionsResponse,
} from '../../models/transaction.models';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private httpClient: HttpClient) {}

  getAllTransactions(params?: {
    [key: string]: string | number;
  }): Observable<TransactionsResponse> {
    return this.httpClient.get<TransactionsResponse>(
      `${BASE_URL}/transactions`,
      {
        params,
      }
    );
  }

  getUserTransactions(
    accountId: string,
    params?: { [key: string]: string | number }
  ): Observable<TransactionsResponse> {
    return this.httpClient.get<TransactionsResponse>(
      `${BASE_URL}/account/${accountId}/transactions`,
      { params }
    );
  }

  getAllTransactionsPdf(params?: {
    [key: string]: string | number;
  }): Observable<DownloadURLResponse> {
    return this.httpClient.get<DownloadURLResponse>(
      `http://localhost:8080/api/reports`,
      {
        params,
      }
    );
  }

  getUserTransactionsPdf(
    accountId: string,
    params?: { [key: string]: string | number }
  ): Observable<DownloadURLResponse> {
    return this.httpClient.get<DownloadURLResponse>(
      `http://localhost:8080/api/reports/${accountId}`,
      { params }
    );
  }
}
