import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProductsApi } from '../../../products/services/products-api';
import { ProductData } from '../../../products/models/product-data';
import { CategoriesApi } from '../../services/categories-api';
import { Category } from '../../models/category';
import { CartService } from '../../../../shared/services/cart.service';
import { CartItemWithProduct } from '../../../../shared/models/cart';

@Component({
  selector: 'bajaj-category-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-details.html',
  styleUrls: ['./category-details.css']
})
export class CategoryDetails implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _categoriesApi = inject(CategoriesApi);
  private _productsApi = inject(ProductsApi);
  private _cartService = inject(CartService);
  private _subscription = new Subscription();

  category: Category | null = null;
  products: ProductData[] = [];
  loading = true;
  error = '';
  cartItems: CartItemWithProduct[] = [];
  addedToCartMap: Record<string, boolean> = {};

  ngOnInit(): void {
    this._subscription.add(
      this._cartService.cart$.subscribe((items) => {
        this.cartItems = items;
        this.refreshAddedToCartMap();
      })
    );

    const identifier = this._route.snapshot.paramMap.get('slug') ?? this._route.snapshot.paramMap.get('name');
    if (identifier) {
      this.loadCategoryDetails(identifier);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  addToCart(product: ProductData): void {
    if (!product?._id || this.addedToCartMap[product._id]) {
      return;
    }
    this._cartService.addProduct(product);
  }

  private refreshAddedToCartMap(): void {
    const map: Record<string, boolean> = {};
    this.cartItems.forEach((item) => {
      if (item.productId) {
        map[item.productId] = true;
      }
    });
    this.addedToCartMap = map;
  }

  loadCategoryDetails(identifier: string): void {
    this.loading = true;

    const normalized = identifier.toLowerCase();

    this._categoriesApi.getCategories().subscribe({
      next: (res) => {
        const categories = res.categories || [];
        const match =
          categories.find((category) => category.slug.toLowerCase() === normalized) ||
          categories.find((category) => category.name.toLowerCase() === normalized);

        if (match) {
          this.category = match;
          this.loadProductsByCategory(match.slug);
        } else {
          this.error = 'Category not found.';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }

  loadProductsByCategory(categoryName: string): void {
    this._productsApi.getProductsByCategoryName(categoryName).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products for this category';
        this.products = [];
        this.loading = false;
        console.error(err);
      }
    });
  }
}
