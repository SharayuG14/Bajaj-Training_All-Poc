import { Component, inject, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";

import { ProductDetailsResponse } from "../../models/product-details-response";

import { ProductsApi } from "../../services/products-api";
import { CartService } from "../../../../shared/services/cart.service";

@Component({
  selector: 'bajaj-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit, OnChanges, OnDestroy {
  private _productsApi = inject(ProductsApi);
  private _cdr = inject(ChangeDetectorRef);
  private _route = inject(ActivatedRoute);
  private _cartService = inject(CartService);
  private _router = inject(Router);
  private _subscription = new Subscription();
  private _routeSubscription = new Subscription();
  protected product: ProductDetailsResponse | null = null;
  @Input() public productId: string;
  @Output() public onClose = new EventEmitter<void>();

  ngOnInit() {
    if (this.productId) {
      this.loadProductDetails();
    } else {
      this._routeSubscription = this._route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id && id !== this.productId) {
          this.productId = id;
          this.loadProductDetails();
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && !changes['productId'].firstChange) {
      this.loadProductDetails();
    }
  }

  private loadProductDetails() {
    if (!this.productId) {
      return;
    }

    this._subscription.unsubscribe();
    this._subscription = this._productsApi.getProductDetails(this.productId).subscribe({
      next: (response) => {
        this.product = response;
        this._cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        this.loadMockProductDetails();
      }
    });
  }

  private loadMockProductDetails() {
    const mockProduct: ProductDetailsResponse = {
      success: true,
      data: {
        _id: this.productId,
        name: 'Product Name',
        sku: 'SKU-001',
        description: 'This is a sample product description. Please connect to the backend to see real product details.',
        price: 1999,
        discount: 15,
        categoryId: { _id: 'cat1', name: 'Electronics' },
        brand: 'Brand Name',
        images: ['assets/images/placeholder.png'],
        stock: 10,
        rating: 4.5,
        numReviews: 50,
        attributes: { color: 'Black', material: 'Plastic', warranty: '1 year' },
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    this.product = mockProduct;
    this._cdr.markForCheck();
  }

  protected addToCart() {
    if (!this.product?.data) {
      return;
    }

    this._cartService.addProduct(this.product.data);
    this._router.navigate(['/cart']);
  }

  closeModal() {
    this.onClose.emit();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._routeSubscription.unsubscribe();
  }
}
