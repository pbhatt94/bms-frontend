import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { AccountsResponse } from '../../models/user.models';
import { BASE_URL } from '../../shared/constants/constants';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  const mockAccount = {
    id: '123',
    accountNumber: 'ACC123',
    balance: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  };

  const mockResponse: AccountsResponse = {
    status: 'SUCCESS',
    message: 'Operation successful',
    data: mockAccount,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountService],
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('deposit', () => {
    it('should make a POST request to deposit money', () => {
      const accountId = '123';
      const amount = 500;

      service.deposit(accountId, amount).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/${accountId}/deposit`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ amount });

      req.flush(mockResponse);
    });

    it('should handle deposit error response', () => {
      const accountId = '123';
      const amount = 500;
      const errorResponse = {
        status: 'ERROR',
        message: 'Deposit failed',
        data: null,
      };

      service.deposit(accountId, amount).subscribe({
        error: (error) => {
          expect(error.message).toBe('Deposit failed');
        },
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/${accountId}/deposit`
      );
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('withdraw', () => {
    it('should make a POST request to withdraw money', () => {
      const accountId = '123';
      const amount = 300;

      service.withdraw(accountId, amount).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/${accountId}/withdraw`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ amount });

      req.flush(mockResponse);
    });

    it('should handle withdraw error response', () => {
      const accountId = '123';
      const amount = 300;
      const errorResponse = {
        status: 'ERROR',
        message: 'Insufficient funds',
        data: null,
      };

      service.withdraw(accountId, amount).subscribe({
        error: (error) => {
          expect(error.message).toBe('Insufficient funds');
        },
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/${accountId}/withdraw`
      );
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('transfer', () => {
    it('should make a POST request to transfer money', () => {
      const accountId = '123';
      const amount = 200;
      const targetAccountNumber = 'ACC456';

      service
        .transfer(accountId, amount, targetAccountNumber)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/${accountId}/transfer`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ amount, targetAccountNumber });

      req.flush(mockResponse);
    });

    it('should handle transfer error response', () => {
      const accountId = '123';
      const amount = 200;
      const targetAccountNumber = 'ACC456';
      const errorResponse = {
        status: 'ERROR',
        message: 'Invalid target account',
        data: null,
      };

      service.transfer(accountId, amount, targetAccountNumber).subscribe({
        error: (error) => {
          expect(error.status).toBe('ERROR');
          expect(error.message).toBe('Invalid target account');
        },
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/${accountId}/transfer`
      );
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });
});
