import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { AuthService } from '../../services/auth-service/auth.service';
import {
  Transaction,
  TransactionsResponse,
} from '../../models/transaction.models';
import { AccountService } from '../../services/account-service/account.service';
import { TransactionService } from '../../services/transaction-service/transaction.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AccountsResponse } from '../../models/user.models';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    CurrencyPipe,
    ToastModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  providers: [MessageService],
})
export class AccountComponent implements OnInit {
  authService = inject(AuthService);
  accountService = inject(AccountService);
  transactionService = inject(TransactionService);
  messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  user = computed(() => this.authService.currentUser());

  showDeposit: boolean = false;
  showWithdraw: boolean = false;
  showTransfer: boolean = false;

  // transactionAmount: number = 0;
  // recipientAccount: string = '';

  depositForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]],
  });

  withdrawForm = this.fb.group({
    amount: [
      0,
      [
        Validators.required,
        Validators.min(1),
        (control: { value: any }) => {
          const value = control.value;
          const balance = this.user()?.account?.balance || 0;

          return value > balance ? { exceedsBalance: true } : null;
        },
      ],
    ],
  });

  transferForm = this.fb.group({
    amount: [
      0,
      [
        Validators.required,
        Validators.min(1),
        (control: { value: any }) => {
          const value = control.value;
          const balance = this.user()?.account?.balance || 0;

          return value > balance ? { exceedsBalance: true } : null;
        },
      ],
    ],
    recipientAccount: ['', Validators.required],
  });

  recentTransactions: Transaction[] = [];

  ngOnInit(): void {
    this.loadRecentTransactions();
  }

  loadRecentTransactions() {
    const params: { [key: string]: string | number } = {};
    params['pageNumber'] = 0;
    params['pageSize'] = 3;
    this.transactionService
      .getUserTransactions(this.user()?.account.id!, params)
      .subscribe({
        next: (response: TransactionsResponse) => {
          this.recentTransactions = response.data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  deposit() {
    if (this.depositForm.valid) {
      this.accountService
        .deposit(
          this.user()?.account.id!,
          this.depositForm.get('amount')!.value!
        )
        .subscribe({
          next: (response: AccountsResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.authService.fetchAndStoreUserDetails();
            this.loadRecentTransactions();
            this.hideDialog();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to deposit money.',
            });
          },
        });
    }
  }

  withdraw() {
    if (this.withdrawForm.valid) {
      const withdrawAmount = this.withdrawForm.get('amount')!.value!;
      const currentBalance = this.user()?.account?.balance || 0;

      if (withdrawAmount > currentBalance) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Withdrawal amount cannot exceed current balance.',
        });
        return;
      }

      this.accountService
        .withdraw(this.user()?.account.id!, withdrawAmount)
        .subscribe({
          next: (response: AccountsResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.authService.fetchAndStoreUserDetails();
            this.loadRecentTransactions();
            this.hideDialog();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to withdraw money.',
            });
          },
        });
    }
  }

  transfer() {
    if (this.transferForm.valid) {
      this.accountService
        .transfer(
          this.user()?.account.id!,
          this.transferForm.get('amount')!.value!,
          this.transferForm.get('recipientAccount')!.value!
        )
        .subscribe({
          next: (response: AccountsResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.authService.fetchAndStoreUserDetails();
            this.loadRecentTransactions();
            this.hideDialog();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to transfer money.',
            });
          },
        });
    }
  }

  getTransactionIcon(transaction: Transaction): string {
    const baseClass = 'pi ';
    switch (transaction.transactionType) {
      case 'DEPOSIT':
        return baseClass + 'pi-arrow-up text-green-500';
      case 'WITHDRAWAL':
        return baseClass + 'pi-arrow-down text-red-500';
      case 'TRANSFER':
        return baseClass + 'pi-send text-blue-500';
      default:
        return baseClass + 'pi-circle-fill';
    }
  }

  getAmountClass(transaction: Transaction): string {
    switch (transaction.transactionType) {
      case 'DEPOSIT':
        return 'text-green-500 font-medium';
      case 'WITHDRAWAL':
      case 'TRANSFER':
        return 'text-red-500 font-medium';
      default:
        return 'font-medium';
    }
  }

  getAmountPrefix(transaction: Transaction): string {
    switch (transaction.transactionType) {
      case 'DEPOSIT':
        return '+';
      case 'WITHDRAWAL':
      case 'TRANSFER':
        return '-';
      default:
        return '';
    }
  }

  showDepositDialog() {
    this.depositForm.reset({ amount: 0 });
    this.showDeposit = true;
  }

  showWithdrawDialog() {
    this.withdrawForm.reset({ amount: 0 });
    this.showWithdraw = true;
  }

  showTransferDialog() {
    this.transferForm.reset({ amount: 0, recipientAccount: '' });
    this.showTransfer = true;
  }

  hideDialog() {
    this.showDeposit = false;
    this.showWithdraw = false;
    this.showTransfer = false;
    this.depositForm.reset();
    this.withdrawForm.reset();
    this.transferForm.reset();
  }
}
