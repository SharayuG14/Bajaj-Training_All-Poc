import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';
import { OrderService } from '../../../../shared/services/order.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { CartItemWithProduct, CartSummary } from '../../../../shared/models/cart';
import { Address, User } from '../../../../shared/models/user';
import { OrderCreateRequest } from '../../../../shared/models/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItemWithProduct[] = [];
  cartSummary: CartSummary = {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  };
  currentUser: User | null = null;
  isLoading = false;
  currentStep = 1; // 1: Address, 2: Payment, 3: Review

  paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: '💳' },
    { id: 'debit_card', name: 'Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'net_banking', name: 'Net Banking', icon: '🏦' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' }
  ];

  getPaymentMethodName(methodId: string | null | undefined): string {
    if (!methodId) {
      return '';
    }

    return this.paymentMethods.find(method => method.id === methodId)?.name ?? '';
  }

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      // Address fields
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      country: ['India', Validators.required],
      
      // Payment fields
      paymentMethod: ['', Validators.required],
      
      // Card fields (conditional)
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: [''],
      cardName: [''],
      
      // UPI field (conditional)
      upiId: ['']
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    this.cartService.cartSummary$.subscribe(summary => {
      this.cartSummary = summary;
    });

    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user && user.addresses.length > 0) {
        const defaultAddress = user.addresses.find((addr: Address) => addr.isDefault) || user.addresses[0];
        this.patchAddressForm(defaultAddress);
      }
    });

    this.setupPaymentValidation();
  }

  private patchAddressForm(address: Address): void {
    this.checkoutForm.patchValue({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country
    });
  }

  private setupPaymentValidation(): void {
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.clearPaymentValidators();
      
      if (method === 'credit_card' || method === 'debit_card') {
        this.setCardValidators();
      } else if (method === 'upi') {
        this.setUpiValidators();
      }
    });
  }

  private clearPaymentValidators(): void {
    ['cardNumber', 'cardExpiry', 'cardCvv', 'cardName', 'upiId'].forEach(field => {
      this.checkoutForm.get(field)?.clearValidators();
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  private setCardValidators(): void {
    this.checkoutForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
    this.checkoutForm.get('cardExpiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
    this.checkoutForm.get('cardCvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    this.checkoutForm.get('cardName')?.setValidators([Validators.required]);
    
    ['cardNumber', 'cardExpiry', 'cardCvv', 'cardName'].forEach(field => {
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  private setUpiValidators(): void {
    this.checkoutForm.get('upiId')?.setValidators([Validators.required, Validators.pattern(/^[\w\.\-_]{2,256}@[a-zA-Z]{2,64}$/)]);
    this.checkoutForm.get('upiId')?.updateValueAndValidity();
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.isLoading = true;
    
    const formValue = this.checkoutForm.value;
    const shippingAddress: Address = {
      label: 'Shipping Address',
      street: formValue.street,
      city: formValue.city,
      state: formValue.state,
      postalCode: formValue.postalCode,
      country: formValue.country,
      isDefault: false
    };

    const orderData: OrderCreateRequest = {
      items: this.orderService.convertCartItemsToOrderItems(this.cartItems),
      shippingAddress: shippingAddress,
      paymentMethod: formValue.paymentMethod
    };

    console.log('Placing order:', orderData);

    this.orderService.createOrderWithProductNames(this.cartItems, orderData).subscribe({
      next: (order) => {
        console.log('✅ Order placed successfully:', order);
        this.isLoading = false;
        this.cartService.clearCart();
        this.router.navigate(['/orders'], { 
          queryParams: { orderPlaced: true } 
        });
      },
      error: (error) => {
        console.error('❌ Failed to place order:', error);
        this.isLoading = false;
        alert('Failed to place order. Please try again.');
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  get f() { 
    return this.checkoutForm.controls; 
  }
}