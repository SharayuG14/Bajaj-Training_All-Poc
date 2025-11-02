import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../../../shared/services/cart.service';
import { CartItemWithProduct, CartSummary } from '../../../../shared/models/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItemWithProduct[] = [];
  cartSummary: CartSummary = {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  };
  isLoading = false;
  private _subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this._subscription.add(
      this.cartService.cart$.subscribe((items: CartItemWithProduct[]) => {
        this.cartItems = items;
      })
    );

    this._subscription.add(
      this.cartService.cartSummary$.subscribe((summary: CartSummary) => {
        this.cartSummary = summary;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;
    
    this.isLoading = true;
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(productId: string): void {
    this.isLoading = true;
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error removing item:', error);
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  getItemTotal(item: CartItemWithProduct): number {
    return item.price * item.quantity;
  }
}