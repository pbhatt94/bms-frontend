import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { BASE_URL } from '../../shared/constants/constants';
import {
  Transaction,
  TransactionsResponse,
  TransactionType,
} from '../../models/transaction.models';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  const transaction1: Transaction = {
    id: '1',
    amount: 8000.0,
    transactionType: TransactionType.TRANSFER,
    sourceAccount: {
      id: 'db37bf87-63a8-400d-8fda-4638a5fb3635',
      accountNumber: '197083240808',
      balance: 896.0,
      createdAt: new Date('2024-10-13T18:14:25.746985'),
      updatedAt: new Date('2025-01-28T10:03:50.794353'),
      active: true,
    },
    targetAccount: {
      id: '82eb9ecf-f8ec-4c75-8775-476f6bad0d03',
      accountNumber: '058148577001',
      balance: 8219.0,
      createdAt: new Date('2024-10-13T18:14:25.746985'),
      updatedAt: new Date('2025-01-28T10:03:50.794353'),
      active: true,
    },
    createdAt: '2025-01-28T10:03:50.808313',
  };

  const transaction2: Transaction = {
    id: '2',
    amount: 12222.0,
    transactionType: TransactionType.TRANSFER,
    sourceAccount: {
      id: 'db37bf87-63a8-400d-8fda-4638a5fb3635',
      accountNumber: '197083240808',
      balance: 896.0,
      createdAt: new Date('2024-10-13T18:14:25.746985'),
      updatedAt: new Date('2025-01-28T10:03:50.794353'),
      active: true,
    },
    targetAccount: {
      id: '82eb9ecf-f8ec-4c75-8775-476f6bad0d03',
      accountNumber: '058148577001',
      balance: 8219.0,
      createdAt: new Date('2024-10-13T18:14:25.746985'),
      updatedAt: new Date('2025-01-28T10:03:50.794353'),
      active: true,
    },
    createdAt: '2025-01-28T10:03:39.064137',
  };

  const transaction3: Transaction = {
    id: '3',
    amount: 11111.0,
    transactionType: TransactionType.TRANSFER,
    sourceAccount: {
      id: 'db37bf87-63a8-400d-8fda-4638a5fb3635',
      accountNumber: '197083240808',
      balance: 896.0,
      createdAt: new Date('2024-10-13T18:14:25.746985'),
      updatedAt: new Date('2025-01-28T10:03:50.794353'),
      active: true,
    },
    targetAccount: {
      id: '82eb9ecf-f8ec-4c75-8775-476f6bad0d03',
      accountNumber: '058148577001',
      balance: 8219.0,
      createdAt: new Date('2024-10-13T18:14:25.746985'),
      updatedAt: new Date('2025-01-28T10:03:50.794353'),
      active: true,
    },
    createdAt: '2025-01-28T10:03:25.827252',
  };

  const transactionsResponse: TransactionsResponse = {
    status: 'SUCCESS',
    message: 'Transactions fetched successfully.',
    data: [transaction1, transaction2, transaction3],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService],
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTransactions', () => {
    it('should fetch all transactions without params', () => {
      const mockResponse: TransactionsResponse = transactionsResponse;

      service.getAllTransactions().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/transactions`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch all transactions with pagination', () => {
      const mockResponse = {
        ...transactionsResponse,
        data: transactionsResponse.data.slice(0, 2),
      };
      const params = { page: '0', limit: '2' };

      service.getAllTransactions(params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/transactions?page=0&limit=2`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch all transactions with type filter', () => {
      const mockResponse = transactionsResponse;
      const params = { transactionType: 'TRANSFER' };

      service.getAllTransactions(params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/transactions?transactionType=TRANSFER`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getUserTransactions', () => {
    it('should fetch all user transactions without params', () => {
      const mockResponse: TransactionsResponse = transactionsResponse;

      service.getUserTransactions('abc').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/account/abc/transactions`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch all user transactions with pagination', () => {
      const mockResponse = {
        ...transactionsResponse,
        data: transactionsResponse.data.slice(0, 2),
      };
      const params = { page: '0', limit: '2' };

      service.getUserTransactions('abc', params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/abc/transactions?page=0&limit=2`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch all user transactions with type filter', () => {
      const mockResponse = transactionsResponse;
      const params = { transactionType: 'TRANSFER' };

      service.getUserTransactions('abc', params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/account/abc/transactions?transactionType=TRANSFER`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
