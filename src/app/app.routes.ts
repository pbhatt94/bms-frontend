import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { LoginGuard } from './shared/guards/login-guard/login.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: UserHomeComponent, canActivate: [LoginGuard] },
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
      // {
      //   path: 'issues',
      //   loadComponent: () =>
      //     import('./components/admin/issues/issues.component').then(m => m.IssuesComponent)
      // },
      // {
      //   path: 'transactions',
      //   loadComponent: () =>
      //     import('./components/admin/transactions/transactions.component').then(m => m.TransactionsComponent)
      // },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
    ],
  },
];
