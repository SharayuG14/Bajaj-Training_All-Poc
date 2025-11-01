import { ProductListResponse } from '../features/products/models/product-list-response';

const BASE_URL = 'http://localhost:9090/api/products';

type GetProductsOptions = {
  category?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
};

export async function getProducts(options: GetProductsOptions = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const response = await fetch(queryString ? `${BASE_URL}?${queryString}` : BASE_URL);

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  return (await response.json()) as ProductListResponse;
}
