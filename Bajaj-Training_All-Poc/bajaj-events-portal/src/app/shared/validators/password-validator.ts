import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Custom validator for password field.
 * Rule: Password length must be > 6 characters.
 */
@Directive({
  selector: '[passwordLengthValidator]', // 👈 use this in template
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordLengthValidatorDirective,
      multi: true, // allows multiple validators on one field
    },
  ],
})
export class PasswordLengthValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();

    if (!value) return null; // handled by "required" validator separately

    return value.length > 6 ? null : { passwordTooShort: true };
  }
}
