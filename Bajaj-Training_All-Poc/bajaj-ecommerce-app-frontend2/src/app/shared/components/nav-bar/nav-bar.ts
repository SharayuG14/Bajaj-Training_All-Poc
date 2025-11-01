// import { Component } from '@angular/core';

// @Component({
//   selector: 'bajaj-nav-bar',
//   imports: [],
//   templateUrl: './nav-bar.html',
//   styleUrl: './nav-bar.css',
// })
// export class NavBar {

// }

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesApi } from '../../../features/categories/services/categories-api';
import { Category } from '../../../features/categories/models/category';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'bajaj-navbar-left',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class Navbar implements OnInit, OnDestroy {
  private _categoriesApi = inject(CategoriesApi);
  private _authService = inject(AuthService);
  private _subscription = new Subscription();
  
  protected categories: Category[] = [];
  protected isAuthenticated = false;
  protected isAdmin = false;

  ngOnInit(): void {
    this._subscription.add(
      this._categoriesApi.getCategories().subscribe({
        next: (data) => {
          this.categories = data.categories;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.loadMockCategories();
        }
      })
    );

    this._subscription.add(
      this._authService.currentUser$.subscribe((user) => {
        this.isAuthenticated = !!user;
        this.isAdmin = user?.role === 'admin';
      })
    );
  }

  private loadMockCategories(): void {
    this.categories = [
      {
        _id: '68fb484229cdb792d0865997',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        image: 'https://picsum.photos/seed/DJozhIPiD/640/480?blur=7',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.001Z',
        updatedAt: '2025-10-24T09:34:59.001Z'
      },
      {
        _id: '68fb484229cdb792d0865998',
        name: 'Fashion',
        slug: 'fashion',
        parentId: null,
        image: 'https://picsum.photos/seed/whRXfRsV/640/480?blur=10',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.004Z',
        updatedAt: '2025-10-24T09:34:59.004Z'
      },
      {
        _id: '68fb484229cdb792d0865999',
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        parentId: null,
        image: 'https://picsum.photos/seed/WYSGJsfPdG/640/480?blur=4',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      },
      {
        _id: '68fb484229cdb792d086599a',
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        parentId: null,
        image: 'https://picsum.photos/seed/3TLH0eMP/640/480?blur=3',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      },
      {
        _id: '68fb484229cdb792d086599b',
        name: 'Beauty & Health',
        slug: 'beauty-health',
        parentId: null,
        image: 'https://picsum.photos/seed/LBpBrK9du/640/480',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      },
      {
        _id: '68fb484229cdb792d086599c',
        name: 'Books & Stationery',
        slug: 'books-stationery',
        parentId: null,
        image: 'https://picsum.photos/seed/tSCpR2Y/640/480?blur=7',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      },
      {
        _id: '68fb484229cdb792d086599d',
        name: 'Toys & Baby',
        slug: 'toys-baby',
        parentId: null,
        image: 'https://picsum.photos/seed/5uyjxwsg/640/480?blur=9',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      },
      {
        _id: '68fb484229cdb792d086599e',
        name: 'Groceries',
        slug: 'groceries',
        parentId: null,
        image: 'https://picsum.photos/seed/3S7qTG/640/480?blur=6',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      },
      {
        _id: '68fb484229cdb792d086599f',
        name: 'Automotive',
        slug: 'automotive',
        parentId: null,
        image: 'https://picsum.photos/seed/yVkfH/640/480',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      },
      {
        _id: '68fb484229cdb792d08659a0',
        name: 'Jewellery',
        slug: 'jewellery',
        parentId: null,
        image: 'https://picsum.photos/seed/5D0yf8i6K/640/480?grayscale&blur=9',
        __v: 0,
        createdAt: '2025-10-24T09:34:59.005Z',
        updatedAt: '2025-10-24T09:34:59.005Z'
      }
    ];
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}

