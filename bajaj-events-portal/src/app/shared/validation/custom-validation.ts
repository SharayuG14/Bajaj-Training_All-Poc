import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidation {
  
  // ============================================
  // ✅ EMPLOYEE REGISTRATION VALIDATORS
  // ============================================

  // Employee ID validator - must be greater than 0
  static employeeIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null; // Let required validator handle empty values
      }
      const id = parseInt(control.value, 10);
      if (isNaN(id) || id <= 0) {
        return { invalidEmployeeId: true };
      }
      return null;
    };
  }

  // Employee name validator - only letters and spaces, minimum 2 characters
  static employeeNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const nameRegex = /^[a-zA-Z\s]{2,}$/;
      const isValid = nameRegex.test(control.value);
      return isValid ? null : { invalidEmployeeName: true };
    };
  }

  // Joining date validator - cannot be in the future
  static joiningDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        return { futureDateNotAllowed: true };
      }
      return null;
    };
  }

  // ZIP code: must be 4–6 digits
  static zipcodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      return /^[0-9]{4,6}$/.test(value.toString()) ? null : { invalidZipcode: true };
    };
  }

  // Phone number format check - accepts multiple formats
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      // Regex: +91-9876543210, 9876543210, (91)9876543210, +919876543210, etc.
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      return phoneRegex.test(control.value) ? null : { invalidPhone: true };
    };
  }

  // ============================================
  // ✅ EVENT REGISTRATION VALIDATORS
  // ============================================

  // Event ID validator - must be greater than 0
  static eventIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      const id = parseInt(control.value, 10);
      if (isNaN(id) || id <= 0) {
        return { invalidEventId: true };
      }
      return null;
    };
  }

  // Event code validator - exactly 6 characters
  static eventCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const codeRegex = /^[A-Z0-9]{6}$/;
      return codeRegex.test(control.value.toString().toUpperCase()) ? null : { invalidEventCode: true };
    };
  }

  // Event name validator - letters, spaces and numbers, minimum 3 characters
  static eventNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const nameRegex = /^[a-zA-Z0-9\s]{3,}$/;
      return nameRegex.test(control.value) ? null : { invalidEventName: true };
    };
  }

  // Event start date validator - cannot be in the past
  static eventStartDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return { pastDateNotAllowed: true };
      }
      return null;
    };
  }

  // Event end date must be after start date
  static eventEndDateValidator(startControlName: string = 'startDate'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent || !control.value) return null;
      const startDate = control.parent.get(startControlName)?.value;
      const endDate = control.value;
      
      if (!startDate || !endDate) return null;
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return end > start ? null : { invalidEndDate: true };
    };
  }

  // Fees validator - must be non-negative
  static feesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      const fees = parseFloat(control.value);
      if (isNaN(fees) || fees < 0) {
        return { invalidFees: true };
      }
      return null;
    };
  }

  // Seats validator - must be between 0 and 100
  static seatsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      const seats = parseInt(control.value, 10);
      if (isNaN(seats) || seats < 0 || seats > 100) {
        return { invalidSeats: true };
      }
      return null;
    };
  }

  // ============================================
  // ✅ LEGACY VALIDATORS (For backward compatibility)
  // ============================================

  // Name must start with a capital letter
  static nameStartsWithCapital(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      return /^[A-Z]/.test(value) ? null : { capitalError: true };
    };
  }

  // ZIP code (legacy)
  static zipCodeValidator(): ValidatorFn {
    return this.zipcodeValidator();
  }

  // Date cannot be in the future (legacy)
  static dateNotInFuture(): ValidatorFn {
    return this.joiningDateValidator();
  }

  // Event end date must be after start date (legacy)
  static endDateAfterStartDate(startControlName: string): ValidatorFn {
    return this.eventEndDateValidator(startControlName);
  }

  // ============================================
  // ✅ CENTRALIZED ERROR MESSAGE MAPPING
  // ============================================

  /**
   * Get user-friendly error messages for validation errors
   * Used by both Employee and Event registration forms
   */
  static getErrorMessage(fieldName: string, errors: any): string {
    if (!errors) return '';

    // Common validators
    if (errors['required']) return `${this.formatFieldName(fieldName)} is required`;
    if (errors['email']) return 'Please enter a valid email';
    if (errors['minlength']) return `${this.formatFieldName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.formatFieldName(fieldName)} must not exceed ${errors['maxlength'].requiredLength} characters`;

    // Employee validators
    if (errors['invalidEmployeeId']) return 'Employee ID must be greater than 0';
    if (errors['invalidEmployeeName']) return 'Employee name must contain only letters (min 2 characters)';
    if (errors['invalidPhone']) return 'Please enter a valid phone number';
    if (errors['invalidZipcode']) return 'Zipcode must be 4-6 digits';
    if (errors['futureDateNotAllowed']) return 'Joining date cannot be in the future';

    // Event validators
    if (errors['invalidEventId']) return 'Event ID must be greater than 0';
    if (errors['invalidEventCode']) return 'Event code must be 6 alphanumeric characters (e.g., EVT001)';
    if (errors['invalidEventName']) return 'Event name must contain 3+ characters (letters, numbers, spaces)';
    if (errors['pastDateNotAllowed']) return 'Start date cannot be in the past';
    if (errors['invalidEndDate']) return 'End date must be after the start date';
    if (errors['invalidFees']) return 'Fees must be a non-negative number';
    if (errors['invalidSeats']) return 'Seats must be between 0 and 100';

    return 'Invalid field';
  }

  /**
   * Format field name for display (e.g., employeeName -> Employee Name)
   */
  private static formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}
