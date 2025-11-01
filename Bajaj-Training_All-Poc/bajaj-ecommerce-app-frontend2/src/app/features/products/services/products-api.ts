import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductListResponse } from '../models/product-list-response';
import { ProductDetailsResponse } from '../models/product-details-response';
import { CreateProductPayload, ProductData } from '../models/product-data';

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private _baseUrl = 'http://localhost:9090/api';
  private _http = inject(HttpClient);

  getProducts(params?: {
    category?: string;
    keyword?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<ProductListResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        const v = (params as any)[k];
        if (v !== undefined && v !== null && v !== '') {
          httpParams = httpParams.set(k, String(v));
        }
      });
    }
    return this._http.get<ProductListResponse>(`${this._baseUrl}/products`, { params: httpParams });
  }

  getProductDetails(id: string) {
    return this._http.get<ProductDetailsResponse>(`${this._baseUrl}/products/${id}`);
  }

  getProductsByCategoryName(category: string): Observable<ProductListResponse> {
    return this.getProducts({ category });
  }

  searchProducts(query: string) {
    return this.getProducts({ keyword: query });
  }

  createProduct(payload: CreateProductPayload): Observable<ProductData> {
    return this._http.post<ProductData>(`${this._baseUrl}/products`, payload);
  }
}
