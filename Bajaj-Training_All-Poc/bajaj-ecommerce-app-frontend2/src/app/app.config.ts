import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // ✅ your routes file
import { AuthService } from './shared/services/auth.service';

const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const isApiRequest = req.url.startsWith('http://localhost:9090/api');
  if (!isApiRequest) {
    return next(req);
  }

  const normalizedToken = token.trim();
  const headerValue = normalizedToken.toLowerCase().startsWith('bearer ')
    ? normalizedToken
    : `Bearer ${normalizedToken}`;

  const authorizedRequest = req.clone({
    setHeaders: {
      Authorization: headerValue
    }
  });

  return next(authorizedRequest);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes) // ✅ correct usage
  ]
};
