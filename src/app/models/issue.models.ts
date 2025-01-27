import { ResponseType } from './models';
import { User } from './user.models';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewIssueDetails {
  userId: string;
  title: string;
  description: string;
  priority?: string;
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum IssueStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
}

export interface IssuesResponse {
  status: ResponseType;
  message: string;
  data: Issue[];
}

export interface IssueResponse {
  status: ResponseType;
  message: string;
  data: Issue;
}
