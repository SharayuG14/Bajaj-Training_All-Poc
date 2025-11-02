import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesApi } from '../../services/categories-api';
import { Category } from '../../models/category';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'bajaj-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-list.html',
  styleUrls: ['./categories-list.css']
})
export class CategoryList implements OnInit {
  private _categoriesApi = inject(CategoriesApi);

  categories: Category[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.loading = true;
    this._categoriesApi.getCategories().subscribe({
      next: (response) => {
        this.categories = (response.categories || [])
          .sort((a, b) => a.name.localeCompare(b.name)); // ✅ Sort alphabetically
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load categories. Please try again later.';
        this.loading = false;
      }
    });
  }
}
