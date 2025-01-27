import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { IssueService } from '../../services/issue-service/issue.service';
import { UserService } from '../../services/user-service/user.service';
import {
  Issue,
  IssuesResponse,
  NewIssueDetails,
  IssueStatus,
  IssuePriority,
} from '../../models/issue.models';
import { User, UsersResponse } from '../../models/user.models';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../services/auth-service/auth.service';
import { Role } from '../../models/models';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    Textarea,
    MultiSelectModule,
    ToastModule,
    ReactiveFormsModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    InputTextModule,
  ],
  providers: [MessageService],
  templateUrl: './issues.component.html',
})
export class IssuesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private issueService = inject(IssueService);
  private userService = inject(UserService);

  issues: Issue[] = [];
  allIssues: Issue[] = [];
  users: User[] = [];
  loading = false;
  newIssueDialogVisible = false;
  userDetailsDialogVisible = false;
  selectedUser: User | null = null;
  issueDetailsDialogVisible = false;
  selectedIssue: Issue | null = null;
  isAdmin = this.authService.role$() === Role.admin;

  statusFilter: string | undefined = undefined;
  priorityFilter: string | undefined = undefined;

  issueForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    priority: ['', Validators.required],
  });

  statusOptions = Object.values(IssueStatus);
  priorityOptions = Object.values(IssuePriority);

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues(statusFilter?: string, priorityFilter?: string) {
    this.loading = true;

    const params: { [key: string]: string } = {};
    if (statusFilter) params['status'] = statusFilter;
    if (priorityFilter) params['priority'] = priorityFilter;
    console.log(this.isAdmin);

    this.isAdmin ? this.getAllIssues(params) : this.getUserIssues(params);
  }

  getAllIssues(params: { [key: string]: string } = {}) {
    this.issueService.getAllIssues(params).subscribe({
      next: (response: IssuesResponse) => {
        this.allIssues = response.data;
        this.issues = [...this.allIssues];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load issues.',
        });
      },
    });
  }

  getUserIssues(params: { [key: string]: string } = {}) {
    this.issueService
      .getUserIssues(this.authService.currentUser()?.userId!, params)
      .subscribe({
        next: (response: IssuesResponse) => {
          this.allIssues = response.data;
          this.issues = [...this.allIssues];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load issues.',
          });
        },
      });
  }

  applyFilters() {
    this.loadIssues(this.statusFilter, this.priorityFilter);
  }

  clearFilters() {
    this.statusFilter = undefined;
    this.priorityFilter = undefined;
    this.loadIssues();
  }

  showUserDetails(user: User) {
    this.selectedUser = user;
    this.userDetailsDialogVisible = true;
  }

  showIssueDetails(issue: Issue) {
    this.selectedIssue = issue;
    this.issueDetailsDialogVisible = true;
  }

  createIssue() {
    if (this.issueForm.valid) {
      const formValue = this.issueForm.value;
      const newIssue: NewIssueDetails = {
        userId: formValue.assignee.id,
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
      };

      this.issueService.raiseIssue(newIssue).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Issue created.',
          });
          this.loadIssues();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create issue.',
          });
        },
      });

      this.hideNewIssueDialog();
    }
  }

  resolveIssue(issue: Issue) {
    this.issueService.updateIssue(issue.id, IssueStatus.RESOLVED).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Issue ${issue.id} resolved.`,
        });
        this.loadIssues();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to resolve issue ${issue.id}.`,
        });
      },
    });
  }

  toggleIssueStatus(issue: Issue) {
    const newStatus =
      issue.status === IssueStatus.PENDING
        ? IssueStatus.RESOLVED
        : IssueStatus.PENDING;

    this.issueService.updateIssue(issue.id, newStatus).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${issue.user.name}'s issue status updated to ${newStatus}.`,
        });
        this.loadIssues();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update issue status for ${issue.user.name}.`,
        });
      },
    });
  }

  showNewIssueDialog() {
    this.loadUsers();
    this.newIssueDialogVisible = true;
  }

  hideNewIssueDialog() {
    this.newIssueDialogVisible = false;
    this.issueForm.reset();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: UsersResponse) => {
        this.users = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users.',
        });
      },
    });
  }

  get currentUser() {
    return {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: this.isAdmin,
    };
  }
}
