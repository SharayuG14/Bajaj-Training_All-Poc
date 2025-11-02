import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EventRegistration } from './../../models/event-registration';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { EventsApi } from './../../service/events-api';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../../../shared/validation/validation.service';

@Component({
  selector: 'app-register-event',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-event.html',
  styleUrl: './register-event.css',
})
export class RegisterEvent implements OnInit {
  private _eventsApi = inject(EventsApi);
  private _router = inject(Router);
  private _validationService = inject(ValidationService);
  private _eventsApiSubscription?: Subscription;

  protected title: string = 'Register New Bajaj Event!';
  protected register: EventRegistration = new EventRegistration();
  protected isSubmitting: boolean = false;
  protected successMessage: string = '';
  protected errorMessage: string = '';

  ngOnInit(): void {
    // Clear messages when form changes
    this.register.eventForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  // Check if field should show error (uses validation service)
  protected shouldShowError(fieldName: string): boolean {
    const field = this.register.eventForm.get(fieldName);
    return this._validationService.shouldShowError(field, this.isSubmitting);
  }

  // Get error message for a field (uses validation service)
  protected getErrorMessage(fieldName: string): string {
    const field = this.register.eventForm.get(fieldName);
    if (!field || !field.errors) return '';
    return this._validationService.getErrorMessage(fieldName, field.errors);
  }

  protected onEventSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Mark all fields as touched to show validation errors
    this._validationService.markAllFieldsTouched(this.register.eventForm.controls);

    if (this.register.eventForm.valid) {
      const formData = this.register.eventForm.value;
      console.log('Submitting event data:', formData);

      this._eventsApiSubscription = this._eventsApi.scheduleNewEvent(formData).subscribe({
        next: (data) => {
          if (data.acknowledged === true) {
            this.successMessage = '✅ Event registered successfully! Redirecting...';
            console.log('✅ Event registered successfully!');
            setTimeout(() => {
              this._router.navigate(['/events']);
            }, 1500);
          } else {
            this.errorMessage = '⚠️ Event registration failed. Please try again.';
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          this.errorMessage = `❌ Error: ${err.error?.message || err.message || 'Failed to register event'}`;
          this.isSubmitting = false;
          console.error('Error registering event:', err);
        },
      });
    } else {
      this.errorMessage = '❌ Please fix all validation errors before submitting.';
      this.isSubmitting = false;
    }
  }

  ngOnDestroy(): void {
    if (this._eventsApiSubscription) {
      this._eventsApiSubscription.unsubscribe();
    }
  }
}
