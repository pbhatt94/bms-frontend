import { ResponseType } from './models';
import { Account } from './user.models';

export interface Transaction {
  id: string;
  amount: number;
  transactionType: TransactionType;
  sourceAccount: Account;
  targetAccount: Account;
  createdAt: string;
}

export interface TransactionsResponse {
  status: ResponseType;
  message: string;
  data: Transaction[];
}

export interface DownloadURLResponse {
  downloadUrl: string;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
}
