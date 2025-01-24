import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../services/user-service/user.service';
import { NewUserDetails, User, UsersResponse } from '../../models/user.models';
import { ResponseType } from '../../models/models';
import { CustomValidators } from '../../shared/custom-validator/custom-validators';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  userDialogVisible: boolean = false;
  dialogMode: 'add' | 'edit' = 'add';
  userForm: FormGroup;
  selectedUser: User | null = null;
  first = 0;
  rows = 10;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, CustomValidators.isValidPassword]],
      age: [0, [Validators.required, Validators.min(18), Validators.max(120)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phoneNo: [0, [Validators.required, CustomValidators.isValidPhoneNumber]],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 0, rows: number = 10) {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: UsersResponse): void => {
        if (response.status === 'SUCCESS') {
          this.users = response.data;
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error loading the users.',
        });
      },
    });
    this.loading = false;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.users ? this.first + this.rows >= this.users.length : true;
  }

  isFirstPage(): boolean {
    return this.users ? this.first === 0 : true;
  }

  showUserDialog(mode: 'add' | 'edit', user?: User) {
    this.dialogMode = mode;
    if (mode === 'edit' && user) {
      this.selectedUser = user;
      this.userForm.patchValue(user);
    } else {
      this.userForm.reset();
      this.selectedUser = null;
    }
    this.userDialogVisible = true;
  }

  hideDialog() {
    this.userDialogVisible = false;
    this.userForm.reset();
  }

  saveUser() {
    if (this.userForm.valid) {
      const userDetails: NewUserDetails = this.userForm.value;

      if (this.dialogMode === 'add') {
        this.userService.addUser(userDetails).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `User added successfully`,
            });
            this.hideDialog();
            setTimeout(() => this.loadUsers(), 2200);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error adding the user.',
            });
          },
        });
      }

      if (this.dialogMode === 'edit') {
        this.userService
          .updateUser(this.selectedUser!.userId, userDetails)
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `User updated successfully`,
              });
              this.hideDialog();
              this.loadUsers();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an error updating the user.',
              });
            },
          });
      }
    }
  }

  confirmToggleStatus(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${'Active' === 'Active' ? 'block' : 'unblock'} this user?`,
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${'Active' === 'Active' ? 'blocked' : 'unblocked'} successfully`,
        });
        this.loadUsers();
      },
    });
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      accept: () => {
        this.userService.deleteUser(user.userId).subscribe({
          next: (response: any) => console.log(response),
        });
        setTimeout(() => this.loadUsers(), 1800);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelled',
          detail: 'User deletion was cancelled',
        });
      },
    });
  }
}
