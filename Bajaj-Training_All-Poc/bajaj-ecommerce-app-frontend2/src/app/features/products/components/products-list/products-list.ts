// import { Component, inject } from '@angular/core';
// import { Subscription } from 'rxjs';

// import { ProductsApi } from '../../services/products-api';

// import { ProductListResponse } from "../../models/product-list-response";
// import { ProductDetails } from '../product-details/product-details';

// @Component({
//   selector: 'bajaj-products-list',
//   imports: [ProductDetails],
//   templateUrl: './products-list.html',
//   styleUrl: './products-list.css',
// })
// export class ProductsList {
//   private _productApi = inject(ProductsApi);
//   protected readonly title: string = "Shoppping! Shopping! Shopping!";
//   protected product: ProductListResponse;
//   private _subscription = new Subscription();
//   protected selectedProductId: string;
//   ngOnInit(): void {
//     this._productApi.getproducts().subscribe({
//       next: data => {
//         this.product = data
//       }
//     });
//   }
//   ngOnDestroy() {
//     if (this._subscription) {
//       this._subscription.unsubscribe();
//     }
//   }
//   protected onProductSelection(id: string): void {
//     this.selectedProductId = id;
//   }
// }



// -------------------------------------------------------------------------

import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProductDetails } from '../product-details/product-details';
import { ProductsApi } from '../../services/products-api';
import { ProductListResponse } from '../../models/product-list-response';
import { ProductData } from '../../models/product-data';
import { CategoriesApi } from '../../../categories/services/categories-api';
import { Category } from '../../../categories/models/category';
import { CartService } from '../../../../shared/services/cart.service';
import { CartItemWithProduct } from '../../../../shared/models/cart';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'round' })
export class RoundPipe implements PipeTransform {
  transform(value: number): number {
    return Math.round(value);
  }
}

@Component({
  selector: 'bajaj-products-list',
  standalone: true,
  imports: [ProductDetails, CommonModule, RouterModule, NgxPaginationModule, RoundPipe],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css'],
})
export class ProductsList implements OnInit, OnDestroy {
  Math = Math;

  private _productApi = inject(ProductsApi);
  private _categoriesApi = inject(CategoriesApi);
  private _activatedRoute = inject(ActivatedRoute);
  private _cdr = inject(ChangeDetectorRef);
  private _cartService = inject(CartService);
  private _subscription = new Subscription();

  protected readonly defaultTitle = 'Shopping! Shopping! Shopping!';
  protected title: string = this.defaultTitle;
  protected cartItems: CartItemWithProduct[] = [];
  protected addedToCartMap: Record<string, boolean> = {};

  protected product: ProductListResponse = {
    success: true,
    total: 0,
    page: 1,
    pages: 1,
    count: 0,
    data: []
  };

  protected selectedProductId!: string;
  protected currentPage = 1;
  protected itemsPerPage = 6;
  protected loading = true;
  protected errorMessage = '';
  protected categoryId: string | null = null;
  protected category: Category | null = null;

  ngOnInit(): void {
    this._subscription.add(
      this._cartService.cart$.subscribe((items) => {
        this.cartItems = items;
        this.refreshAddedToCartMap();
        this._cdr.markForCheck();
      })
    );

    this._subscription.add(
      this._activatedRoute.params.subscribe((params) => {
        this.categoryId = params['id'];
        this.loading = true;

        if (this.categoryId) {
          this.loadCategoryProducts(this.categoryId);
        } else {
          this.loadAllProducts();
        }
      })
    );
  }

  // 🔹 Load products by category
  private loadCategoryProducts(categoryId: string): void {
    this.currentPage = 1;
    this._subscription.add(
      this._categoriesApi.getCategoryById(categoryId).subscribe({
        next: (response) => {
          this.category = response.category;
          this.title = this.category?.name || this.defaultTitle;
          this._cdr.markForCheck();
          this.fetchProductsByCategory(categoryId);
        },
        error: (err) => {
          this.errorMessage = 'Failed to load category details';
          this.loading = false;
          this._cdr.markForCheck();
        },
      })
    );
  }

  // 🔹 Fetch products filtered by category
  private fetchProductsByCategory(categoryId: string): void {
    this._subscription.add(
      this._productApi.getProducts().subscribe({
        next: (data: ProductListResponse) => {
          if (data?.data) {
            const filtered = data.data.filter(
              (p: any) =>
                p.categoryId === categoryId || p.categoryId?._id === categoryId
            );
            this.product = { ...data, data: filtered };
          }
          this.loading = false;
          this.errorMessage = '';
          this._cdr.markForCheck();
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to load products for this category';
          this.loading = false;
          this._cdr.markForCheck();
        },
      })
    );
  }

  // 🔹 Load all products from backend
  private loadAllProducts(): void {
    this.currentPage = 1;
    this.title = this.defaultTitle;

    this._subscription.add(
      this._productApi.getProducts().subscribe({
        next: (data: ProductListResponse) => {
          if (data?.data?.length) {
            this.product = data;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'No products found.';
          }
          this.loading = false;
          this._cdr.markForCheck();
        },
        error: (err: any) => {
          this.errorMessage =
            'Backend connection failed. Please make sure your backend server is running at http://localhost:9090/api/products';
          this.loading = false;
          this._cdr.markForCheck();
        },
      })
    );
  }

  protected addToCart(product: ProductData): void {
    if (!product || !product._id || this.addedToCartMap[product._id]) {
      return;
    }

    this._cartService.addProduct(product);
  }

  private refreshAddedToCartMap(): void {
    const marker: Record<string, boolean> = {};
    this.cartItems.forEach((item) => {
      if (item.productId) {
        marker[item.productId] = true;
      }
    });
    this.addedToCartMap = marker;
  }

  // 🔹 Pagination handling
  protected get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.product.data.slice(start, end);
  }

  protected nextPage() {
    const totalPages = Math.ceil(this.product.data.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this._cdr.markForCheck();
    }
  }

  protected prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this._cdr.markForCheck();
    }
  }

  // 🔹 Product selection
  protected onProductSelection(id: string): void {
    this.selectedProductId = id;
  }

  protected clearSelectedProduct(): void {
    this.selectedProductId = '';
  }

  protected trackById(index: number, item: any): string {
    return item._id;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
