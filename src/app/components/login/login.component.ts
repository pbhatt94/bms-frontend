import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../services/auth-service/auth.service';
// import { ToastService } from '../../services/toast-service/toast.service';
import { CustomValidators } from '../../shared/custom-validator/custom-validators';
import { LoginResponse } from '../../models/auth.models';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../../models/models';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  // private toastService = inject(ToastService);

  form = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', Validators.required),
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('form submitted');

      this.loading = true;
      const username = this.form.value.username!;
      const password = this.form.value.password!;

      this.authService.login(username, password).subscribe({
        next: (response: LoginResponse): void => {
          // this.toastService.showSuccess('Login Successful');
          localStorage.setItem('authToken', response.data['JWT Token']);
          const decodedToken: { role: string } = jwtDecode(
            response.data['JWT Token']
          );
          this.authService.role$.set(
            decodedToken.role === 'ROLE_ADMIN' ? Role.admin : Role.customer
          );
          this.authService.loggedIn$.set(true);
          this.loading = false;
          if (this.authService.role$() === Role.admin) {
            this.router.navigate(['admin/home']);
          } else {
            this.router.navigate(['home']);
          }
        },
        error: (error: HttpErrorResponse): void => {
          // this.toastService.showError(error.error.message);
          console.error(error);
        },
      });
      this.loading = false;
    }
  }
}
