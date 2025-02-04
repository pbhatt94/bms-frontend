import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { IssueService } from './issue.service';
import { BASE_URL } from '../../shared/constants/constants';
import { ResponseType, Role } from '../../models/models';
import {
  Issue,
  IssueStatus,
  IssuePriority,
  NewIssueDetails,
  IssuesResponse,
  IssueResponse,
} from '../../models/issue.models';
import { User } from '../../models/user.models';

describe('IssueService', () => {
  let service: IssueService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    userId: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    age: 30,
    phoneNo: '1234567890',
    address: '123 Street',
    password: 'password123',
    role: Role.user,
    account: {
      id: 'acc123',
      accountNumber: 'ACC001',
      balance: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    },
  };

  const mockIssue: Issue = {
    id: 'issue123',
    title: 'Test Issue',
    description: 'Test Description',
    status: IssueStatus.PENDING,
    priority: IssuePriority.MEDIUM,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockIssuesResponse: IssuesResponse = {
    status: 'SUCCESS',
    message: 'Issues retrieved successfully',
    data: [mockIssue],
  };

  const mockIssueResponse: IssueResponse = {
    status: 'SUCCESS',
    message: 'Issue processed successfully',
    data: mockIssue,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssueService],
    });
    service = TestBed.inject(IssueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllIssues', () => {
    it('should retrieve all issues without params', () => {
      service.getAllIssues().subscribe((response) => {
        expect(response).toEqual(mockIssuesResponse);
        expect(response.data.length).toBe(1);
      });

      const req = httpMock.expectOne(`${BASE_URL}/issues`);
      expect(req.request.method).toBe('GET');
      req.flush(mockIssuesResponse);
    });

    it('should retrieve issues with query parameters', () => {
      const params = {
        status: IssueStatus.PENDING,
        priority: IssuePriority.HIGH,
      };

      service.getAllIssues(params).subscribe((response) => {
        expect(response).toEqual(mockIssuesResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/issues?status=PENDING&priority=HIGH`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockIssuesResponse);
    });

    it('should handle empty issues list', () => {
      const emptyResponse = {
        status: 'SUCCESS',
        message: 'No issues found',
        data: [],
      };

      service.getAllIssues().subscribe((response) => {
        expect(response.data.length).toBe(0);
      });

      const req = httpMock.expectOne(`${BASE_URL}/issues`);
      expect(req.request.method).toBe('GET');
      req.flush(emptyResponse);
    });
  });

  describe('getUserIssues', () => {
    const userId = 'user123';

    it('should retrieve user issues without params', () => {
      service.getUserIssues(userId).subscribe((response) => {
        expect(response).toEqual(mockIssuesResponse);
        expect(response.data[0].user.userId).toBe(userId);
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/${userId}/issues`);
      expect(req.request.method).toBe('GET');
      req.flush(mockIssuesResponse);
    });

    it('should retrieve user issues with query parameters', () => {
      const params = {
        status: IssueStatus.PENDING,
        priority: IssuePriority.HIGH,
      };

      service.getUserIssues(userId, params).subscribe((response) => {
        expect(response).toEqual(mockIssuesResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/user/${userId}/issues?status=PENDING&priority=HIGH`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockIssuesResponse);
    });

    it('should handle invalid user ID', () => {
      const invalidUserId = 'invalid123';
      const errorResponse = {
        status: 'ERROR',
        message: 'User not found',
        data: null,
      };

      service.getUserIssues(invalidUserId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/user/${invalidUserId}/issues`
      );
      expect(req.request.method).toBe('GET');
      req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('raiseIssue', () => {
    it('should create a new issue', () => {
      const newIssue: NewIssueDetails = {
        userId: 'user123',
        title: 'New Issue',
        description: 'New Description',
        priority: IssuePriority.HIGH,
      };

      service.raiseIssue(newIssue).subscribe((response) => {
        expect(response).toEqual(mockIssueResponse);
        expect(response.data.title).toBe(mockIssue.title);
      });

      const req = httpMock.expectOne(`${BASE_URL}/issues`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newIssue);
      req.flush(mockIssueResponse);
    });

    it('should handle validation errors', () => {
      const invalidIssue: NewIssueDetails = {
        userId: 'user123',
        title: '',
        description: 'Description',
        priority: IssuePriority.LOW,
      };

      const errorResponse = {
        status: 'ERROR',
        message: 'Title is required',
        data: null,
      };

      service.raiseIssue(invalidIssue).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/issues`);
      expect(req.request.method).toBe('POST');
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateIssue', () => {
    it('should update issue status', () => {
      const issueId = 'issue123';
      const newStatus = IssueStatus.RESOLVED;

      const updatedMockResponse = {
        ...mockIssueResponse,
        data: {
          ...mockIssue,
          status: newStatus,
        },
      };

      service.updateIssue(issueId, newStatus).subscribe((response) => {
        expect(response).toEqual(updatedMockResponse);
        expect(response.data.status).toBe(newStatus);
      });

      const req = httpMock.expectOne(`${BASE_URL}/issues/${issueId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: newStatus });
      req.flush(updatedMockResponse);
    });

    it('should handle non-existent issue', () => {
      const invalidIssueId = 'invalid123';
      const status = IssueStatus.RESOLVED;
      const errorResponse = {
        status: 'ERROR',
        message: 'Issue not found',
        data: null,
      };

      service.updateIssue(invalidIssueId, status).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/issues/${invalidIssueId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
    });

    it('should handle invalid status transition', () => {
      const issueId = 'issue123';
      const invalidStatus = IssueStatus.PENDING;
      const errorResponse = {
        status: 'ERROR',
        message: 'Invalid status transition',
        data: null,
      };

      service.updateIssue(issueId, invalidStatus).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/issues/${issueId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });
});
