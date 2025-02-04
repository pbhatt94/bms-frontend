import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { BASE_URL } from '../../shared/constants/constants';
import { Role } from '../../models/models';
import {
  NewUserDetails,
  UpdateUserDetails,
  User,
  UserResponse,
  UsersResponse,
} from '../../models/user.models';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    userId: '123',
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

  const mockUsersResponse: UsersResponse = {
    status: 'SUCCESS',
    message: 'Users retrieved successfully',
    data: [mockUser],
    page: 0,
    size: 10,
    totalItems: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('should retrieve all users with default parameters', () => {
      service.getAllUsers().subscribe((response) => {
        expect(response).toEqual(mockUsersResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/users?size=100&page=0&name=`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsersResponse);
    });

    it('should retrieve users with custom parameters', () => {
      service.getAllUsers(0, 50, 'John').subscribe((response) => {
        expect(response).toEqual(mockUsersResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/users?size=50&page=0&name=John`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockUsersResponse);
    });
  });

  describe('getProfile', () => {
    it('should retrieve user profile', () => {
      const mockResponse: UserResponse = {
        status: 'SUCCESS',
        message: 'Profile retrieved successfully',
        data: mockUser,
      };

      service.getProfile().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/users/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('addUser', () => {
    it('should add a new user', () => {
      const newUser: NewUserDetails = {
        username: 'newuser',
        password: 'User@12345',
        age: 25,
        name: 'New User',
        email: 'newuser@example.com',
        address: '456 Street',
        phoneNo: 9876543210,
      };

      const mockResponse: UserResponse = {
        status: 'SUCCESS',
        message: 'User created successfully',
        data: mockUser,
      };

      service.addUser(newUser).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      const userId = '123';
      const mockResponse: UserResponse = {
        status: 'SUCCESS',
        message: 'User deleted successfully',
        data: mockUser,
      };

      service.deleteUser(userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('updateUser', () => {
    it('should update a user', () => {
      const userId = '123';
      const updateDetails: UpdateUserDetails = {
        username: 'updated',
        age: 31,
        name: 'Updated Name',
        email: 'updated@example.com',
        address: 'Updated Address',
        phoneNo: 1122334455,
      };

      service.updateUser(userId, updateDetails).subscribe((response) => {
        expect(response.status).toBe(200);
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDetails);
      req.flush({}, { status: 200, statusText: 'OK' });
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by ID', () => {
      const userId = '123';
      const mockResponse: UserResponse = {
        status: 'SUCCESS',
        message: 'User retrieved successfully',
        data: mockUser,
      };

      service.getUserById(userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('checkEmailExists', () => {
    it('should check if email exists for new user', () => {
      const email = 'test@example.com';

      service.checkEmailExists(email).subscribe((response) => {
        expect(response).toBe(true);
      });

      const req = httpMock.expectOne(`${BASE_URL}/check-email/${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should check if email exists for existing user', () => {
      const email = 'john@example.com';
      const userId = '123';
      const mockUserResponse: UserResponse = {
        status: 'SUCCESS',
        message: 'User retrieved successfully',
        data: mockUser,
      };

      service.checkEmailExists(email, userId).subscribe((response) => {
        expect(response).toBe(false);
      });

      const userReq = httpMock.expectOne(`${BASE_URL}/user/${userId}`);
      expect(userReq.request.method).toBe('GET');
      userReq.flush(mockUserResponse);
    });
  });

  describe('checkUsernameExists', () => {
    it('should check if username exists for new user', () => {
      const username = 'testuser';

      service.checkUsernameExists(username).subscribe((response) => {
        expect(response).toBe(true);
      });

      const req = httpMock.expectOne(`${BASE_URL}/check-username/${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should check if username exists for existing user', () => {
      const username = 'johndoe';
      const userId = '123';
      const mockUserResponse: UserResponse = {
        status: 'SUCCESS',
        message: 'User retrieved successfully',
        data: mockUser,
      };

      service.checkUsernameExists(username, userId).subscribe((response) => {
        expect(response).toBe(false);
      });

      const userReq = httpMock.expectOne(`${BASE_URL}/user/${userId}`);
      expect(userReq.request.method).toBe('GET');
      userReq.flush(mockUserResponse);
    });
  });
});
