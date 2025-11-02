import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { EmployeeApi } from '../../services/employee-api';
import { EmployeeRegistration } from '../../models/employee-registration';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../../../shared/validation/validation.service';

@Component({
  selector: 'app-register-employee',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-employee.html',
  styleUrls: ['./register-employee.css'],
  standalone: true,
})
export class RegisterEmployee implements OnInit {
  
  private _employeesApi = inject(EmployeeApi);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _validationService = inject(ValidationService);

  private _employeesApiSubscription?: Subscription;

  protected employeeRegistration: EmployeeRegistration;
  protected title: string = 'Register New Employee!';
  protected isSubmitting: boolean = false;
  protected successMessage: string = '';
  protected errorMessage: string = '';
  protected formTouched = new Map<string, boolean>();

  constructor() {
    this.employeeRegistration = new EmployeeRegistration(this._fb);
  }

  ngOnInit(): void {
    // Mark form as touched when user tries to submit
    this.employeeRegistration.employeeForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  // Check if field should show error (uses validation service)
  protected shouldShowError(fieldName: string): boolean {
    const field = this.employeeRegistration.employeeForm.get(fieldName);
    return this._validationService.shouldShowError(field, this.isSubmitting);
  }

  // Get error message for a field (uses validation service)
  protected getErrorMessage(fieldName: string): string {
    const field = this.employeeRegistration.employeeForm.get(fieldName);
    if (!field || !field.errors) return '';
    return this._validationService.getErrorMessage(fieldName, field.errors);
  }

  // Submit method
  protected onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Mark all fields as touched to show validation errors
    this._validationService.markAllFieldsTouched(this.employeeRegistration.employeeForm.controls);

    if (this.employeeRegistration.employeeForm.valid) {
      const formData = this.employeeRegistration.employeeForm.value;
      console.log('Submitting form data:', formData);

      this._employeesApiSubscription = this._employeesApi.registerEmployee(formData).subscribe({
        next: (response) => {
          if (response.acknowledged) {
            this.successMessage = '✅ Employee registered successfully! Redirecting...';
            console.log('✅ Employee registered successfully!');
            setTimeout(() => {
              this._router.navigate(['/employees']);
            }, 1500);
          } else {
            this.errorMessage = ' Employee registration failed. Please try again.';
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          this.errorMessage = ` Error: ${err.error?.message || err.message || 'Failed to register employee'}`;
          this.isSubmitting = false;
          console.error('Error registering employee:', err);
        },
      });
    } else {
      this.errorMessage = ' Please fix all validation errors before submitting.';
      this.isSubmitting = false;
    }
  }

  ngOnDestroy(): void {
    this._employeesApiSubscription?.unsubscribe();
  }
}
