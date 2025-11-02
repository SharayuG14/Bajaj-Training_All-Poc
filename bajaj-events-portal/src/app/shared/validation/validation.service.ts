import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CustomValidation } from './custom-validation';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * Determine if validation error should be displayed for a field
   * Shows error after user interaction (touched/dirty) or after submit attempt
   * 
   * @param field - The form control
   * @param isSubmitting - Whether form submission was attempted
   * @returns true if error should be shown
   */
  shouldShowError(field: AbstractControl | null, isSubmitting: boolean): boolean {
    if (!field) return false;
    return !!(field.invalid && (field.dirty || field.touched || isSubmitting));
  }

  /**
   * Get user-friendly error message for a field
   * 
   * @param fieldName - The field name (e.g., 'employeeName')
   * @param errors - The validation errors object
   * @returns User-friendly error message
   */
  getErrorMessage(fieldName: string, errors: any): string {
    return CustomValidation.getErrorMessage(fieldName, errors);
  }

  /**
   * Mark all form fields as touched to trigger validation display
   * Used when form submission is attempted
   * 
   * @param formControls - Object with form controls
   */
  markAllFieldsTouched(formControls: any): void {
    Object.keys(formControls).forEach(key => {
      formControls[key]?.markAsTouched();
    });
  }
}