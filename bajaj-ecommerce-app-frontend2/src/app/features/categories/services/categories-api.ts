import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryPayload } from '../models/category';

export interface CategoriesResponse {
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesApi {
  private _baseUrl: string = 'http://localhost:9090/api';
  private _httpClient = inject(HttpClient);

  getCategoryByName(name: string): Observable<{ category: Category }> {
    return this._httpClient.get<{ category: Category }>(
      `${this._baseUrl}/categories/name/${name}`
    );
  }
  
  

  getCategories(): Observable<CategoriesResponse> {
    return this._httpClient.get<CategoriesResponse>(`${this._baseUrl}/categories`);
  }

  createCategory(payload: CreateCategoryPayload): Observable<Category> {
    return this._httpClient.post<Category>(`${this._baseUrl}/categories`, payload);
  }

  getCategoryById(id: string): Observable<{ category: Category }> {
    return this._httpClient.get<{ category: Category }>(`${this._baseUrl}/categories/${id}`);
  }

  getMockCategories(): Category[] {
    return [
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
}
