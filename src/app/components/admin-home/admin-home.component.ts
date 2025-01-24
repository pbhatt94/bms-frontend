import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  imports: [CommonModule, RouterModule, HeaderComponent, AdminSidebarComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent {}
