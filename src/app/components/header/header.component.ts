import { Component, inject } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { Role } from '../../models/models';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ToolbarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  navigateToProfile() {
    if (this.authService.role$() === Role.admin)
      this.router.navigate(['/admin/home/profile']);
    else this.router.navigate(['/dashboard/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
