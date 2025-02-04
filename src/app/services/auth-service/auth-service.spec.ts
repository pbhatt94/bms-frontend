import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Role } from '../../models/models';
import { BASE_URL } from '../../shared/constants/constants';
import { LoginResponse } from '../../models/auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser = {
    userId: '1',
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser',
    age: 25,
    phoneNo: '1234567890',
    address: '123 Test St',
    password: 'password',
    role: Role.user,
    account: {
      id: '1',
      accountNumber: 'ACC123',
      balance: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    },
  };

  const mockLoginResponse: LoginResponse = {
    status: 'SUCCESS' as const,
    message: 'Login successful',
    data: {
      'JWT Token': 'mock-jwt-token',
    },
  };

  const mockUserResponse = {
    status: 'SUCCESS' as const,
    message: 'User details fetched successfully',
    data: mockUser,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasValidToken', () => {
    it('should return false when no token exists', () => {
      expect(service.hasValidToken()).toBeFalse();
    });

    it('should return false for expired token', () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.4MW7_-vhUB2Vyton8nr8NAO6qBrGf0GzWd-Zy1-327Y';
      localStorage.setItem('authToken', expiredToken);
      expect(service.hasValidToken()).toBeFalse();
    });
  });

  describe('login', () => {
    it('should send POST request to login endpoint', () => {
      const credentials = {
        username: 'testuser',
        password: 'password',
      };

      service
        .login(credentials.username, credentials.password)
        .subscribe((response) => {
          expect(response).toEqual(mockLoginResponse);
        });

      const req = httpMock.expectOne(`${BASE_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });
  });

  describe('fetchAndStoreUserDetails', () => {
    it('should fetch and store user details successfully', fakeAsync(() => {
      service.fetchAndStoreUserDetails().then(() => {
        expect(service.loggedIn$()).toBeTrue();
        expect(service.currentUser()).toEqual(mockUser);
        expect(service.role$()).toEqual(mockUser.role);
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserResponse);
      tick();
    }));

    it('should handle error when fetching user details', fakeAsync(() => {
      const errorMessage = 'Error fetching user details';

      service.fetchAndStoreUserDetails().catch((error) => {
        expect(errorMessage).toEqual(errorMessage);
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/me`);
      req.error(new ErrorEvent('error', { error: errorMessage }));
      tick();
    }));
  });

  describe('isAdmin', () => {
    it('should return true when user has admin role', () => {
      service.role$.set(Role.admin);
      expect(service.isAdmin()).toBeTrue();
    });

    it('should return false when user has non-admin role', () => {
      service.role$.set(Role.user);
      expect(service.isAdmin()).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should remove auth token from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      service.logout();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });
});
