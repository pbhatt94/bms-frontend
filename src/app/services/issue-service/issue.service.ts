import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASE_URL } from '../../shared/constants/constants';

import { Observable } from 'rxjs';
import {
  Issue,
  IssueResponse,
  IssuesResponse,
  IssueStatus,
  NewIssueDetails,
} from '../../models/issue.models';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  constructor(private httpClient: HttpClient) {}

  getAllIssues(params?: { [key: string]: string }): Observable<IssuesResponse> {
    return this.httpClient.get<IssuesResponse>(`${BASE_URL}/issues`, {
      params,
    });
  }

  getUserIssues(
    userId: string,
    params?: { [key: string]: string }
  ): Observable<IssuesResponse> {
    return this.httpClient.get<IssuesResponse>(
      `${BASE_URL}/user/${userId}/issues`,
      { params }
    );
  }

  raiseIssue(newIssue: NewIssueDetails): Observable<IssueResponse> {
    return this.httpClient.post<IssueResponse>(`${BASE_URL}/issues`, newIssue);
  }

  updateIssue(issueId: string, status: IssueStatus): Observable<IssueResponse> {
    return this.httpClient.put<IssueResponse>(`${BASE_URL}/issues/${issueId}`, {
      status,
    });
  }
}
