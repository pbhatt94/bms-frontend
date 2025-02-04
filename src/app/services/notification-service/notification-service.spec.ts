import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { BASE_URL } from '../../shared/constants/constants';
import { ResponseType } from '../../models/models';
import {
  Notification,
  NotificationResponse,
  NotificationsResponse,
} from '../../models/notification.models';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  const mockNotification: Notification = {
    id: 1,
    message: 'Test notification',
    type: 'SYSTEM_ALERT',
    receiver: {
      id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
    },
    timestamp: new Date(),
  };

  const mockNotificationsResponse: NotificationsResponse = {
    status: 'SUCCESS',
    message: 'Notifications retrieved successfully',
    data: [mockNotification],
  };

  const mockNotificationResponse: NotificationResponse = {
    status: 'SUCCESS',
    message: 'Notification sent successfully',
    data: mockNotification,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllNotifications', () => {
    it('should retrieve all notifications', () => {
      service.getAllNotifications().subscribe((response) => {
        expect(response).toEqual(mockNotificationsResponse);
        expect(response.data.length).toBe(1);
        expect(response.status).toBe('SUCCESS');
      });

      const req = httpMock.expectOne(`${BASE_URL}/notifications`);
      expect(req.request.method).toBe('GET');
      req.flush(mockNotificationsResponse);
    });

    it('should handle empty notifications list', () => {
      const emptyResponse: NotificationsResponse = {
        status: 'SUCCESS',
        message: 'No notifications found',
        data: [],
      };

      service.getAllNotifications().subscribe((response) => {
        expect(response).toEqual(emptyResponse);
        expect(response.data.length).toBe(0);
      });

      const req = httpMock.expectOne(`${BASE_URL}/notifications`);
      expect(req.request.method).toBe('GET');
      req.flush(emptyResponse);
    });

    it('should handle error response', () => {
      const errorResponse = {
        status: 'ERROR',
        message: 'Failed to retrieve notifications',
        data: null,
      };

      service.getAllNotifications().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/notifications`);
      expect(req.request.method).toBe('GET');
      req.flush(errorResponse, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('getUserNotifications', () => {
    const userId = 'user123';

    it('should retrieve notifications for specific user', () => {
      service.getUserNotifications(userId).subscribe((response) => {
        expect(response).toEqual(mockNotificationsResponse);
        expect(response.data[0].receiver.id).toBe(userId);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/user/${userId}/notifications`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockNotificationsResponse);
    });

    it('should handle user with no notifications', () => {
      const emptyResponse: NotificationsResponse = {
        status: 'SUCCESS',
        message: 'No notifications found for user',
        data: [],
      };

      service.getUserNotifications(userId).subscribe((response) => {
        expect(response).toEqual(emptyResponse);
        expect(response.data.length).toBe(0);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/user/${userId}/notifications`
      );
      expect(req.request.method).toBe('GET');
      req.flush(emptyResponse);
    });

    it('should handle invalid user ID', () => {
      const invalidUserId = 'invalid123';
      const errorResponse = {
        status: 'ERROR',
        message: 'User not found',
        data: null,
      };

      service.getUserNotifications(invalidUserId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/user/${invalidUserId}/notifications`
      );
      expect(req.request.method).toBe('GET');
      req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('sendNotification', () => {
    const receiverId = 'user123';
    const message = 'Test notification message';

    it('should send notification successfully', () => {
      const sendNotificationResponse = {
        ...mockNotificationResponse,
        data: {
          ...mockNotificationResponse.data,
          message: 'Test notification message', // Update the message here
        },
      };
      service.sendNotification(receiverId, message).subscribe((response) => {
        expect(response).toEqual(sendNotificationResponse);
        expect(response.data.message).toBe(message);
        expect(response.data.receiver.id).toBe(receiverId);
      });

      const req = httpMock.expectOne(`${BASE_URL}/notifications`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        receiverId,
        message,
        type: 'SYSTEM_ALERT',
      });
      req.flush(sendNotificationResponse);
    });

    it('should handle invalid receiver ID', () => {
      const invalidReceiverId = 'invalid123';
      const errorResponse = {
        status: 'ERROR',
        message: 'Receiver not found',
        data: null,
      };

      service.sendNotification(invalidReceiverId, message).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/notifications`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        receiverId: invalidReceiverId,
        message,
        type: 'SYSTEM_ALERT',
      });
      req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
    });

    it('should handle empty message', () => {
      const emptyMessage = '';
      const errorResponse = {
        status: 'ERROR',
        message: 'Message cannot be empty',
        data: null,
      };

      service.sendNotification(receiverId, emptyMessage).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/notifications`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        receiverId,
        message: emptyMessage,
        type: 'SYSTEM_ALERT',
      });
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });
});
