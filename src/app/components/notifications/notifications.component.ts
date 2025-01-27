import { Component, OnInit, inject } from '@angular/core';
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
import { InputTextarea } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { UserService } from '../../services/user-service/user.service';
import { NotificationService } from '../../services/notification-service/notification.service';
import { User, UsersResponse } from '../../models/user.models';
import {
  Notification,
  NotificationResponse,
  NotificationsResponse,
} from '../../models/notification.models';
import { NotificationTypePipe } from '../../shared/pipes/notification-type.pipe';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextarea,
    MultiSelectModule,
    ToastModule,
    ReactiveFormsModule,
    NotificationTypePipe,
  ],
  providers: [MessageService],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  notifications: Notification[] = [];
  users: User[] = [];
  loading = false;
  newNotificationDialogVisible = false;
  isAdmin = this.authService.isAdmin();

  private userService = inject(UserService);
  private notificationService = inject(NotificationService);

  notificationForm: FormGroup = this.fb.group({
    recipients: [[], Validators.required],
    message: ['', [Validators.required, Validators.maxLength(500)]],
  });

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.isAdmin ? this.getAllNotifications() : this.getUserNotifications();
    this.loading = false;
  }

  loadUsers() {
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
  }

  getAllNotifications(): void {
    this.notificationService.getAllNotifications().subscribe({
      next: (response: NotificationsResponse) => {
        this.notifications = response.data;
      },
    });
  }

  getUserNotifications(): void {
    this.notificationService
      .getUserNotifications(this.authService.currentUser()?.userId!)
      .subscribe({
        next: (response: NotificationsResponse) => {
          this.notifications = response.data;
        },
      });
  }

  sendNotification() {
    if (this.notificationForm.valid) {
      const formValue = this.notificationForm.value;
      formValue.recipients.map((user: User) => {
        console.log(user);

        this.notificationService
          .sendNotification(user.userId, formValue.message)
          .subscribe({
            next: (response: NotificationResponse) => {
              if (response.status === 'SUCCESS') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: `Notification sent to the selected recipient(s)`,
                });
                this.loadNotifications();
              }
            },
            error: () => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an error in sending notification.',
              });
            },
          });
      });

      this.hideNewNotificationDialog();
      this.loadNotifications();
    }
  }

  showNewNotificationDialog() {
    this.loadUsers();
    this.newNotificationDialogVisible = true;
  }

  hideNewNotificationDialog() {
    this.newNotificationDialogVisible = false;
    this.notificationForm.reset();
  }
}
