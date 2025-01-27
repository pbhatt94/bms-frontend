import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OverlayModule } from 'primeng/overlay';
import { Popover } from 'primeng/popover';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { TransactionService } from '../../services/transaction-service/transaction.service';
import { AuthService } from '../../services/auth-service/auth.service';
import {
  DownloadURLResponse,
  Transaction,
  TransactionsResponse,
  TransactionType,
} from '../../models/transaction.models';
import { TransactionPipe } from '../../shared/pipes/transaction.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { catchError, EMPTY, take } from 'rxjs';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    ToastModule,
    OverlayModule,
    TransactionPipe,
    InputNumberModule,
    Popover,
    InputGroup,
    InputGroupAddonModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  providers: [MessageService],
})
export class TransactionsComponent implements OnInit {
  downloadCSV() {
    console.log('downloading csv');
  }
  downloadPDF() {
    console.log('downloading pdf');
  }
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  @ViewChild('op') op!: Popover;
  transactions: Transaction[] = [];
  loading = false;
  transactionDetailsVisible = false;
  selectedTransaction: Transaction | null = null;
  overlayVisible = false;
  isAdmin = this.authService.isAdmin();
  typeFilter?: TransactionType;
  minAmountFilter?: number;
  maxAmountFilter?: number;
  typeOptions = Object.values(TransactionType);
  downloadLink = '';

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;

    const params: { [key: string]: string | number } = {};
    params['pageNumber'] = 0;
    params['pageSize'] = 100;
    if (this.typeFilter) params['transactionType'] = this.typeFilter;
    if (this.minAmountFilter) params['minAmount'] = this.minAmountFilter;
    if (this.maxAmountFilter) params['maxAmount'] = this.maxAmountFilter;

    this.authService.isAdmin()
      ? this.getAllTransactions(params)
      : this.getUserTransactions(params);
  }

  getAllTransactions(params: { [key: string]: string | number }) {
    this.transactionService.getAllTransactions(params).subscribe({
      next: (response: TransactionsResponse) => {
        this.transactions = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getUserTransactions(params: { [key: string]: string | number }) {
    const userAccountId = this.authService.currentUser()!.account.id;
    this.transactionService
      .getUserTransactions(userAccountId, params)
      .subscribe({
        next: (response: TransactionsResponse) => {
          this.transactions = response.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  showTransactionDetails(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.transactionDetailsVisible = true;
  }

  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

  generateDownloadLink(event: any) {
    const downloadObservable = this.isAdmin
      ? this.transactionService.getAllTransactionsPdf()
      : this.transactionService.getUserTransactionsPdf(
          this.authService.currentUser()?.account.id!
        );

    downloadObservable
      .pipe(
        take(1),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Download Error',
            detail: 'Failed to generate PDF link',
          });
          return EMPTY;
        })
      )
      .subscribe({
        next: (response: DownloadURLResponse) => {
          this.downloadLink = response.downloadUrl;
          this.op.toggle(event);
        },
      });
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.downloadLink)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copied',
          detail: 'Download link copied to clipboard',
        });
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to copy link to clipboard',
        });
      });
  }

  applyFilters() {
    console.log(
      'applying filters',
      this.typeFilter,
      this.minAmountFilter,
      this.maxAmountFilter
    );

    this.loadTransactions();
  }

  clearFilters() {
    this.typeFilter = undefined;
    this.minAmountFilter = undefined;
    this.maxAmountFilter = undefined;
    this.loadTransactions();
  }
}
