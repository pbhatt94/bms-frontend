import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export class AuthServiceInterceptor implements HttpInterceptor {
  private readonly publicPaths = [
    '/login',
    '/forgot-password',
    '/reset-password',
  ];

  private router = inject(Router);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isPublicPath = this.publicPaths.some((path) =>
      req.url.includes(path)
    );
    if (isPublicPath) {
      return next.handle(req);
    }
    const token = localStorage.getItem('authToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req);
  }
}
