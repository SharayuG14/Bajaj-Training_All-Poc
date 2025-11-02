import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { ValidationService } from '../../validation/validation.service';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shouldShowError) {
      <div class="invalid-feedback d-block">
        {{ getErrorMessage() }}
      </div>
    }
  `,
  styles: [`
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class FormFieldErrorComponent {
  @Input() fieldName: string = '';
  @Input() field: AbstractControl | null = null;
  @Input() isSubmitting: boolean = false;

  constructor(private validationService: ValidationService) {}

  get shouldShowError(): boolean {
    return this.validationService.shouldShowError(this.field, this.isSubmitting);
  }

  getErrorMessage(): string {
    if (!this.field || !this.field.errors) return '';
    return this.validationService.getErrorMessage(this.fieldName, this.field.errors);
  }
}