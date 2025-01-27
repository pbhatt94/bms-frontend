import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { UpdateUserDetails } from '../../models/user.models';
import { ButtonModule } from 'primeng/button';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CustomValidators } from '../../shared/custom-validator/custom-validators';
import { AuthService } from '../../services/auth-service/auth.service';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-profile',
  imports: [
    ButtonModule,
    NgIf,
    ReactiveFormsModule,
    DialogModule,
    ToastModule,
    InputTextModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [MessageService],
})
export class ProfileComponent {
  authService = inject(AuthService);

  isModalOpen = false;
  userForm: FormGroup;
  dialogMode: 'add' | 'edit' = 'edit';
  userDialogVisible: boolean = false;
  user = this.authService.currentUser()!;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.userForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', [this.passwordValidation.bind(this)]],
        confirmPassword: ['', [this.passwordValidation.bind(this)]],
        age: [
          0,
          [Validators.required, Validators.min(18), Validators.max(120)],
        ],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: ['', Validators.required],
        phoneNo: [
          0,
          [Validators.required, CustomValidators.isValidPhoneNumber],
        ],
      },
      { validators: this.matchPasswords }
    );
  }

  passwordValidation(control: any) {
    if (this.dialogMode === 'add' && !control.value) {
      return { required: true };
    }
    if (control.value && this.dialogMode === 'add') {
      return CustomValidators.isValidPassword()(control);
    }
    return null;
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value &&
      (password.value || confirmPassword.value)
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  openEditUserModal(): void {
    this.isModalOpen = true;
  }

  closeEditUserModal(): void {
    this.isModalOpen = false;
  }

  ngOnInit() {}

  editUser() {
    this.isModalOpen = true;
  }

  saveUser() {
    if (this.userForm.valid) {
      const userDetails: UpdateUserDetails = { ...this.userForm.value };
      if (userDetails?.password?.length! < 8) {
        delete userDetails.password;
      }

      if (this.dialogMode === 'edit') {
        this.userService
          .updateUser(this.authService.currentUser()!.userId, userDetails)
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `User updated successfully`,
              });
              this.hideDialog();
              this.authService.fetchAndStoreUserDetails();
              const userr = this.authService.currentUser()!;
              this.user = userr;
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

  showUserDialog(mode: 'add' | 'edit') {
    this.dialogMode = mode;
    if (mode === 'edit' && this.user) {
      this.userForm.patchValue(this.user);
    } else {
      this.userForm.reset();
    }
    this.userDialogVisible = true;
  }

  hideDialog() {
    this.userDialogVisible = false;
    this.userForm.reset();
  }
}
