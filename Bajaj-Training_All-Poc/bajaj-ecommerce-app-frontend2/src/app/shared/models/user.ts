export type UserRole = 'admin' | 'customer';

export interface Address {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  addresses: Address[];
}
