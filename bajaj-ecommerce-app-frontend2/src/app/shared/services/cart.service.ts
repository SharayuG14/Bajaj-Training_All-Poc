import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CartItem, CartItemWithProduct, CartSummary } from '../models/cart';
import { ProductData } from '../../features/products/models/product-data';

interface PersistedCartItem extends CartItem {
  product: ProductData;
}

interface CartApiPayload {
  items: PersistedCartItem[];
  summary?: CartSummary;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'bajaj_cart_items';
  private readonly apiUrl = 'http://localhost:9090/api/cart';
  private readonly taxRate = 0.1;
  private readonly freeShippingThreshold = 1000;
  private readonly shippingFee = 49;

  private cartSubject = new BehaviorSubject<CartItemWithProduct[]>([]);
  private summarySubject = new BehaviorSubject<CartSummary>(this.emptySummary());

  cart$ = this.cartSubject.asObservable();
  cartSummary$ = this.summarySubject.asObservable();

  constructor(private http: HttpClient) {
    this.rehydrate();
    this.syncFromApi();
  }

  addProduct(product: ProductData): void {
    if (!product?._id) {
      return;
    }

    const current = [...this.cartSubject.value];
    const existingIndex = current.findIndex((item) => item.productId === product._id);

    if (existingIndex > -1) {
      const existing = current[existingIndex];
      current[existingIndex] = {
        ...existing,
        quantity: existing.quantity + 1
      };
    } else {
      current.push(this.createCartItem(product));
    }

    this.updateState(current);
    this.persistToApi(current);
  }

  updateQuantity(productId: string, quantity: number): Observable<void> {
    if (!productId || quantity < 1) {
      return of(void 0);
    }

    const current = [...this.cartSubject.value];
    const index = current.findIndex((item) => item.productId === productId);

    if (index > -1) {
      current[index] = { ...current[index], quantity };
      this.updateState(current);
      this.persistToApi(current);
    }

    return of(void 0);
  }

  removeFromCart(productId: string): Observable<void> {
    if (!productId) {
      return of(void 0);
    }

    const filtered = this.cartSubject.value.filter((item) => item.productId !== productId);
    this.updateState(filtered);
    this.persistToApi(filtered);
    return of(void 0);
  }

  clearCart(): void {
    this.updateState([]);
    this.persistToApi([]);
  }

  isInCart(productId: string): Observable<boolean> {
    return this.cart$.pipe(map((items) => items.some((item) => item.productId === productId)));
  }

  getCartSnapshot(): CartItemWithProduct[] {
    return [...this.cartSubject.value];
  }

  private updateState(items: CartItemWithProduct[]): void {
    this.cartSubject.next(items);
    this.summarySubject.next(this.computeSummary(items));
    this.persist(items);
  }

  private createCartItem(product: ProductData): CartItemWithProduct {
    const price = product.price ?? 0;
    const discount = product.discount ?? 0;
    const discountedPrice = price * (1 - discount / 100);

    const base: CartItem = {
      productId: product._id,
      quantity: 1,
      price: discountedPrice,
      name: product.name ?? 'Product',
      image: product.images?.[0] ?? 'assets/images/placeholder.png',
      discount,
      originalPrice: price
    };

    return {
      ...base,
      product
    };
  }

  private computeSummary(items: CartItemWithProduct[]): CartSummary {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * this.taxRate;
    const shipping = subtotal === 0 || subtotal >= this.freeShippingThreshold ? 0 : this.shippingFee;
    const total = subtotal + tax + shipping;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount
    };
  }

  private persist(items: CartItemWithProduct[]): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      const payload: PersistedCartItem[] = items.map(({ product, ...rest }) => ({
        ...rest,
        product
      }));
      window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to persist cart', error);
    }
  }

  private persistToApi(items: CartItemWithProduct[]): void {
    const payload: CartApiPayload = {
      items: items.map(({ product, ...rest }) => ({
        ...rest,
        product
      })),
      summary: this.summarySubject.value
    };

    this.http.post<CartApiPayload>(this.apiUrl, payload).pipe(catchError(() => of(payload))).subscribe();
    this.persist(items);
  }

  private syncFromApi(): void {
    this.http.get<CartApiPayload>(this.apiUrl).pipe(catchError(() => of(null))).subscribe((response) => {
      if (!response?.items?.length) {
        return;
      }

      const items: CartItemWithProduct[] = response.items.map(({ product, ...rest }) => ({
        ...rest,
        product
      }));

      this.cartSubject.next(items);
      this.summarySubject.next(response.summary ?? this.computeSummary(items));
      this.persist(items);
    });
  }

  private rehydrate(): void {
    if (!this.hasStorage()) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return;
      }

      const parsed: PersistedCartItem[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return;
      }

      const items: CartItemWithProduct[] = parsed.map(({ product, ...rest }) => ({
        ...rest,
        product
      }));

      this.cartSubject.next(items);
      this.summarySubject.next(this.computeSummary(items));
    } catch (error) {
      console.error('Failed to restore cart', error);
      this.cartSubject.next([]);
      this.summarySubject.next(this.emptySummary());
    }
  }

  private emptySummary(): CartSummary {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      itemCount: 0
    };
  }

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
