import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-user-sidebar',
  imports: [CommonModule, MenuModule, RouterModule],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss',
})
export class UserSidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Account',
        icon: 'pi pi-users',
        routerLink: ['/home/account'],
      },
      {
        label: 'Notifications',
        icon: 'pi pi-bell',
        routerLink: ['/home/notifications'],
      },
      {
        label: 'Issues',
        icon: 'pi pi-exclamation-circle',
        routerLink: ['/home/issues'],
      },
      {
        label: 'Transactions',
        icon: 'pi pi-money-bill',
        routerLink: ['/home/transactions'],
      },
    ];
  }
}
