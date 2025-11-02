import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsApi } from '../../../features/products/services/products-api';
import { ProductListResponse } from '../../../features/products/models/product-list-response';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'bajaj-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  searchQuery = '';
  suggestions: string[] = [];
  cartCount = 0;
  isAuthenticated = false;
  isAdmin = false;
  currentUserName = '';

  private _productApi = inject(ProductsApi);
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _subscription = new Subscription();

  ngOnInit(): void {
    this._subscription.add(
      this._cartService.cartSummary$.subscribe((summary) => {
        this.cartCount = summary.itemCount;
      })
    );

    this._subscription.add(
      this._authService.currentUser$.subscribe((user) => {
        this.isAuthenticated = !!user;
        this.isAdmin = user?.role === 'admin';
        this.currentUserName = user?.name ?? '';
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onSearch(event: any) {
    const query = event.target.value.trim();

    if (query.length > 0) {
      this._productApi.searchProducts(query).subscribe({
        next: (data: ProductListResponse) => {
          this.suggestions = data.data.map((p) => p.name);
        },
        error: () => {
          this.suggestions = [];
        }
      });
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.suggestions = [];
    this._router.navigate(['/products'], { queryParams: { keyword: suggestion } });
  }

  navigateToLogin(): void {
    this._router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this._router.navigate(['/register']);
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/home']);
  }
}
