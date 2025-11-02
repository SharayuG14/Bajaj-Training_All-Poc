import { ProductData } from '../../features/products/models/product-data';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  discount: number;
  originalPrice: number;
}

export interface CartItemWithProduct extends CartItem {
  product: ProductData;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}
