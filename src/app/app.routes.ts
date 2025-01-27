import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { LoginGuard } from './shared/guards/login-guard/login.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: UserHomeComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'account',
        loadComponent: () =>
          import('./components/account/account.component').then(
            (m) => m.AccountComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./components/notifications/notifications.component').then(
            (m) => m.NotificationsComponent
          ),
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('./components/issues/issues.component').then(
            (m) => m.IssuesComponent
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./components/transactions/transactions.component').then(
            (m) => m.TransactionsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin/home',
    component: AdminHomeComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./components/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./components/notifications/notifications.component').then(
            (m) => m.NotificationsComponent
          ),
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('./components/issues/issues.component').then(
            (m) => m.IssuesComponent
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./components/transactions/transactions.component').then(
            (m) => m.TransactionsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
    ],
  },
];
