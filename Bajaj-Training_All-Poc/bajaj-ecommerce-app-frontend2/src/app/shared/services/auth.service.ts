import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Address, User, UserRole } from '../models/user';

interface AuthApiUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  addresses?: Address[];
}

interface AuthApiResponse {
  token?: string;
  user?: AuthApiUser;
  refreshToken?: string;
  email?: string;
  role?: string;
  message?: string;
  success?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'bajaj_current_user';
  private readonly tokenKey = 'bajaj_token';
  private readonly refreshTokenKey = 'bajaj_refresh_token';
  private readonly apiUrl = 'http://localhost:9090/api';
  private readonly registerEndpoints = ['users/register', 'user/register', 'auth/register'];
  private readonly loginEndpoints = [
    'users/authenticate',
    'users/login',
    'user/authenticate',
    'user/login',
    'auth/login',
    'auth/authenticate',
    'login',
    'authenticate'
  ];
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private http = inject(HttpClient);

  constructor() {
    this.restoreCurrentUser();
  }

  register(payload: RegisterPayload): Observable<User> {
    const body = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role ?? 'customer'
    };

    return this.tryEndpoints(this.registerEndpoints, body, (url, requestBody) =>
      this.http.post<AuthApiResponse>(`${this.apiUrl}/${url}`, requestBody)
    ).pipe(map((response) => this.handleAuthSuccess(response)), catchError((error) => this.handleError(error)));
  }

  login(payload: LoginPayload): Observable<User> {
    return this.tryEndpoints(this.loginEndpoints, payload, (url, requestBody) =>
      this.http.post<AuthApiResponse>(`${this.apiUrl}/${url}`, requestBody)
    ).pipe(map((response) => this.handleAuthSuccess(response)), catchError((error) => this.handleError(error)));
  }

  logout(): void {
    this.persistToken(null);
    this.persistRefreshToken(null);
    this.setCurrentUser(null);
  }

  getToken(): string | null {
    if (!this.hasStorage()) {
      return null;
    }

    try {
      return window.localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  updateAddress(address: Address): void {
    const current = this.currentUserSubject.value;
    if (!current) {
      return;
    }

    const addresses = current.addresses ?? [];
    const filtered = addresses.filter((item) => item.label !== address.label);
    const updated: User = {
      ...current,
      addresses: [address, ...filtered]
    };

    this.setCurrentUser(updated);
  }

  getCurrentUserSnapshot(): User | null {
    return this.currentUserSubject.value;
  }

  private tryEndpoints<RequestBody>(
    endpoints: string[],
    body: RequestBody,
    executor: (url: string, requestBody: RequestBody) => Observable<AuthApiResponse>
  ): Observable<AuthApiResponse> {
    return endpoints.reduce((attempt, endpoint) => {
      return attempt.pipe(
        catchError((error) => {
          if (error?.status === 404) {
            return executor(endpoint, body);
          }
          return throwError(() => error);
        })
      );
    }, throwError(() => ({ status: 404 })) as Observable<AuthApiResponse>).pipe(
      catchError((error) => {
        if (error?.status === 404) {
          return executor(endpoints[0], body);
        }
        return throwError(() => error);
      })
    );
  }

  private handleAuthSuccess(response: AuthApiResponse): User {
    const token = response.token ?? '';
    if (!token) {
      throw new Error(response.message ?? 'Authentication failed');
    }

    const user = response.user ? this.normalizeUser(response.user) : this.createUserFromResponse(response);

    this.persistToken(token);
    this.persistRefreshToken(response.refreshToken ?? null);
    this.setCurrentUser(user);
    return user;
  }

  private handleError(error: any): Observable<never> {
    const message =
      error?.error?.error ||
      error?.error?.message ||
      error?.message ||
      'Unable to process request';
    return throwError(() => new Error(message));
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.persistCurrentUser(user);
  }

  private normalizeUser(user: AuthApiUser): User {
    const email = typeof user.email === 'string' ? user.email.trim().toLowerCase() : '';
    const identifier = typeof user._id === 'string' && user._id ? user._id : typeof user.id === 'string' ? user.id : '';
    const role: UserRole = user.role === 'admin' ? 'admin' : 'customer';

    return {
      _id: identifier,
      name: typeof user.name === 'string' ? user.name : '',
      email,
      role,
      addresses: Array.isArray(user.addresses) ? user.addresses : []
    };
  }

  private persistCurrentUser(user: User | null): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      if (user) {
        window.localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(this.storageKey);
      }
    } catch {
      return;
    }
  }

  private persistToken(token: string | null): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      if (token) {
        window.localStorage.setItem(this.tokenKey, token);
      } else {
        window.localStorage.removeItem(this.tokenKey);
      }
    } catch {
      return;
    }
  }

  private persistRefreshToken(token: string | null): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      if (token) {
        window.localStorage.setItem(this.refreshTokenKey, token);
      } else {
        window.localStorage.removeItem(this.refreshTokenKey);
      }
    } catch {
      return;
    }
  }

  private restoreCurrentUser(): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (!parsed) {
        return;
      }

      const user = this.normalizeStoredUser(parsed);
      if (user) {
        this.currentUserSubject.next(user);
      }
    } catch {
      return;
    }
  }

  private createUserFromResponse(response: AuthApiResponse): User {
    const email = typeof response.email === 'string' ? response.email.trim().toLowerCase() : '';
    const role: UserRole = response.role === 'admin' ? 'admin' : 'customer';

    return {
      _id: '',
      name: '',
      email,
      role,
      addresses: []
    };
  }

  private normalizeStoredUser(entry: any): User | null {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const email = typeof entry.email === 'string' ? entry.email.trim().toLowerCase() : '';
    if (!email) {
      return null;
    }

    return {
      _id: typeof entry._id === 'string' ? entry._id : '',
      name: typeof entry.name === 'string' ? entry.name : '',
      email,
      role: entry.role === 'admin' ? 'admin' : 'customer',
      addresses: Array.isArray(entry.addresses) ? entry.addresses : []
    };
  }

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
