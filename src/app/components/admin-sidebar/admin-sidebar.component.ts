import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, MenuModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: ['/admin/home/users'],
      },
      {
        label: 'Notifications',
        icon: 'pi pi-bell',
        routerLink: ['/admin/home/notifications'],
      },
      {
        label: 'Issues',
        icon: 'pi pi-exclamation-circle',
        routerLink: ['/admin/home/issues'],
      },
      {
        label: 'Transactions',
        icon: 'pi pi-money-bill',
        routerLink: ['/admin/home/transactions'],
      },
    ];
  }
}
