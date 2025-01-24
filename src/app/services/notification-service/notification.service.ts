import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASE_URL } from '../../shared/constants/constants';

import { Observable } from 'rxjs';
import {
  NotificationResponse,
  NotificationsResponse,
} from '../../models/notification.models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private httpClient: HttpClient) {}

  getAllNotifications(): Observable<NotificationsResponse> {
    return this.httpClient.get<NotificationsResponse>(
      `${BASE_URL}/notifications`
    );
  }

  getUserNotifications(userId: string): Observable<NotificationsResponse> {
    return this.httpClient.get<NotificationsResponse>(
      `${BASE_URL}/user/${userId}/notifications`
    );
  }

  sendNotification(
    receiverId: string,
    message: string
  ): Observable<NotificationResponse> {
    return this.httpClient.post<NotificationResponse>(
      `${BASE_URL}/notifications`,
      {
        receiverId,
        message,
        type: 'SYSTEM_ALERT',
      }
    );
  }
}
