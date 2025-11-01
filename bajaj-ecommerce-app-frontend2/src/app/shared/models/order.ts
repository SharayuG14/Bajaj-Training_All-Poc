import { CartItemWithProduct } from './cart';
import { Address } from './user';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  _id: string;
  userId: string;
  createdAt: string;
  orderStatus: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
}

export interface OrderCreateRequest {
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
}

export interface CartOrderSummary extends OrderCreateRequest {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export function convertCartItems(cartItems: CartItemWithProduct[]): OrderItem[] {
  return cartItems.map((item) => ({
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image
  }));
}
