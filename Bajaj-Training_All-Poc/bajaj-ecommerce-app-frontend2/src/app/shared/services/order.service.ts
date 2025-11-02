import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItemWithProduct } from '../models/cart';
import { Order, OrderCreateRequest, OrderItem } from '../models/order';
import { Address } from '../models/user';
import { AuthService } from './auth.service';

interface PersistedOrder extends Order {}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'bajaj_orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private authService: AuthService) {
    this.restore();
  }

  getUserOrders(): Observable<Order[]> {
    return combineLatest([this.orders$, this.authService.currentUser$]).pipe(
      map(([orders, user]) => this.filterOrdersForCurrentUser(orders, user))
    );
  }

  createOrderWithProductNames(
    cartItems: CartItemWithProduct[],
    request: OrderCreateRequest
  ): Observable<Order> {
    const currentUser = this.authService.getCurrentUserSnapshot();
    if (!currentUser) {
      return throwError(() => new Error('User must be logged in to place an order'));
    }

    const items = this.convertCartItemsToOrderItems(cartItems);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const shippingAddress = this.normalizeShippingAddress(request.shippingAddress);

    const order: Order = {
      _id: this.generateOrderId(),
      userId: currentUser._id,
      createdAt: new Date().toISOString(),
      orderStatus: 'Pending',
      totalAmount,
      items,
      shippingAddress,
      paymentMethod: request.paymentMethod
    };

    this.authService.updateAddress(shippingAddress);

    const updated = [order, ...this.ordersSubject.value];
    this.ordersSubject.next(updated);
    this.persist(updated);

    return of(order);
  }

  private filterOrdersForCurrentUser(orders: Order[], user: any): Order[] {
    if (!user) {
      return [];
    }

    return orders.filter((order) => order.userId === user._id);
  }

  convertCartItemsToOrderItems(cartItems: CartItemWithProduct[]): OrderItem[] {
    return cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return this.orders$.pipe(map((orders) => orders.find((order) => order._id === id)));
  }

  private normalizeShippingAddress(address: Address | undefined): Address {
    if (!address) {
      return {
        label: 'Shipping Address',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      };
    }

    return {
      label: address.label?.trim() || 'Shipping Address',
      street: address.street?.trim() || '',
      city: address.city?.trim() || '',
      state: address.state?.trim() || '',
      postalCode: address.postalCode?.trim() || '',
      country: address.country?.trim() || 'India',
      isDefault: Boolean(address.isDefault)
    };
  }

  private persist(orders: Order[]): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to persist orders', error);
    }
  }

  private restore(): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return;
      }

      const parsed: PersistedOrder[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.ordersSubject.next(parsed);
      }
    } catch (error) {
      console.error('Failed to restore orders', error);
    }
  }

  private generateOrderId(): string {
    return `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
