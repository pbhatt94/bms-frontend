import { ResponseType } from './models';

export interface Notification {
  id: number;
  message: string;
  type: 'SYSTEM_ALERT' | 'ACCOUNT_ACTIVITY';
  receiver: {
    id: string;
    name: string;
    email: string;
    username: string;
  };
  timestamp: Date;
}

export interface NotificationsResponse {
  status: ResponseType;
  message: string;
  data: Notification[];
}

export interface NotificationResponse {
  status: ResponseType;
  message: string;
  data: Notification;
}
