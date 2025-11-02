import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesApi } from '../../../categories/services/categories-api';
import { Category } from '../../../categories/models/category';
import { ProductsApi } from '../../services/products-api';
import { CreateProductPayload } from '../../models/product-data';

@Component({
  selector: 'bajaj-register-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-product.html',
  styleUrls: ['./register-product.css']
})
export class RegisterProduct implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private categoriesApi = inject(CategoriesApi);
  private productsApi = inject(ProductsApi);
  private router = inject(Router);
  private subscription = new Subscription();

  protected categories: Category[] = [];
  protected isSubmitting = false;
  protected submitError = '';
  protected submitSuccess = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.min(0), Validators.max(90)]],
    categoryId: ['', [Validators.required]],
    brand: ['', [Validators.required, Validators.minLength(2)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    isFeatured: [false],
    attributes: this.fb.group({
      color: [''],
      material: [''],
      warranty: ['']
    }),
    images: this.fb.array([this.createImageControl()])
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get images(): FormArray<FormControl<string | null>> {
    return this.form.get('images') as FormArray<FormControl<string | null>>;
  }

  addImageField(): void {
    if (this.images.length >= 5) {
      return;
    }
    this.images.push(this.createImageControl());
  }

  removeImageField(index: number): void {
    if (this.images.length === 1) {
      this.images.at(0).reset('');
      return;
    }

    this.images.removeAt(index);
  }

  submit(): void {
    this.submitError = '';
    this.submitSuccess = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const images = this.images.controls
      .map((control) => control.value?.trim())
      .filter((value): value is string => Boolean(value));

    if (!images.length) {
      this.submitError = 'At least one product image URL is required.';
      return;
    }

    const raw = this.form.getRawValue();
    const attributes = {
      color: raw.attributes?.color?.trim() ?? '',
      material: raw.attributes?.material?.trim() ?? '',
      warranty: raw.attributes?.warranty?.trim() ?? ''
    };

    const filteredAttributes = Object.entries(attributes)
      .filter(([, value]) => Boolean(value))
      .reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const payload: CreateProductPayload = {
      name: raw.name?.trim() ?? '',
      sku: raw.sku?.trim() ?? '',
      description: raw.description?.trim() ?? '',
      price: Number(raw.price),
      discount: raw.discount !== null && raw.discount !== undefined ? Number(raw.discount) : undefined,
      categoryId: raw.categoryId ?? '',
      brand: raw.brand?.trim() ?? '',
      images,
      stock: Number(raw.stock),
      isFeatured: Boolean(raw.isFeatured)
    };

    if (Object.keys(filteredAttributes).length) {
      payload.attributes = filteredAttributes;
    }

    this.isSubmitting = true;

    const request = this.productsApi.createProduct(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = 'Product created successfully.';
        this.resetForm();
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error?.error?.message || error?.message || 'Unable to create product.';
      }
    });

    this.subscription.add(request);
  }

  private createImageControl(): FormControl<string | null> {
    return this.fb.control('', [Validators.required]);
  }

  private loadCategories(): void {
    const request = this.categoriesApi.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories?.length ? response.categories : this.categoriesApi.getMockCategories();
      },
      error: () => {
        this.categories = this.categoriesApi.getMockCategories();
      }
    });

    this.subscription.add(request);
  }

  protected resetForm(): void {
    this.form.reset({
      name: '',
      sku: '',
      description: '',
      price: 0,
      discount: 0,
      categoryId: '',
      brand: '',
      stock: 0,
      isFeatured: false,
      attributes: {
        color: '',
        material: '',
        warranty: ''
      }
    });

    while (this.images.length > 1) {
      this.images.removeAt(0);
    }

    this.images.at(0).setValue('');
  }
}
