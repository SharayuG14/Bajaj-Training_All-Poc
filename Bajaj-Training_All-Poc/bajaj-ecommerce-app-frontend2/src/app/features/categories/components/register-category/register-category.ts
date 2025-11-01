import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesApi } from '../../services/categories-api';
import { Category, CreateCategoryPayload } from '../../models/category';

@Component({
  selector: 'bajaj-register-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-category.html',
  styleUrls: ['./register-category.css']
})
export class RegisterCategory implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private categoriesApi = inject(CategoriesApi);
  private router = inject(Router);
  private subscription = new Subscription();
  private slugManuallyEdited = false;
  private isAutoUpdatingSlug = false;

  protected categories: Category[] = [];
  protected isSubmitting = false;
  protected submitError = '';
  protected submitSuccess = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    parentId: [''],
    image: ['', [Validators.pattern(/^https?:\/\/.+/i)]]
  });

  ngOnInit(): void {
    this.loadCategories();
    this.setupSlugSync();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit(): void {
    this.submitError = '';
    this.submitSuccess = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const name = raw.name?.trim() ?? '';
    const slug = raw.slug?.trim() || this.toSlug(name);

    if (!slug) {
      this.submitError = 'Slug is required.';
      return;
    }

    const payload: CreateCategoryPayload = { name, slug };

    const parentId = raw.parentId?.trim();
    if (parentId) {
      payload.parentId = parentId;
    }

    const image = raw.image?.trim();
    if (image) {
      payload.image = image;
    }

    this.isSubmitting = true;

    const request = this.categoriesApi.createCategory(payload).subscribe({
      next: (category) => {
        this.isSubmitting = false;
        this.submitSuccess = 'Category created successfully.';
        this.resetForm();
        this.upsertCategory(category);
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error?.error?.message || error?.message || 'Unable to create category.';
      }
    });

    this.subscription.add(request);
  }

  private loadCategories(): void {
    const request = this.categoriesApi.getCategories().subscribe({
      next: (response) => {
        const items = response.categories?.length ? response.categories : this.categoriesApi.getMockCategories();
        this.categories = items.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => {
        this.categories = this.categoriesApi.getMockCategories().sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    this.subscription.add(request);
  }

  private setupSlugSync(): void {
    const slugControl = this.form.get('slug');
    const nameControl = this.form.get('name');

    if (slugControl) {
      const slugSub = slugControl.valueChanges.subscribe(() => {
        if (!this.isAutoUpdatingSlug) {
          this.slugManuallyEdited = true;
        }
      });
      this.subscription.add(slugSub);
    }

    if (nameControl && slugControl) {
      const nameSub = nameControl.valueChanges.subscribe((value) => {
        if (this.slugManuallyEdited) {
          return;
        }
        this.isAutoUpdatingSlug = true;
        slugControl.setValue(this.toSlug(value ?? ''), { emitEvent: false });
        this.isAutoUpdatingSlug = false;
      });
      this.subscription.add(nameSub);
    }
  }

  protected resetForm(): void {
    this.slugManuallyEdited = false;
    this.isAutoUpdatingSlug = false;
    this.form.reset({
      name: '',
      slug: '',
      parentId: '',
      image: ''
    });
  }

  private upsertCategory(category: Category): void {
    const existingIndex = this.categories.findIndex((item) => item._id === category._id);
    if (existingIndex >= 0) {
      this.categories.splice(existingIndex, 1, category);
    } else {
      this.categories = [category, ...this.categories];
    }
    this.categories = this.categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  private toSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
