import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator() }
  );

  errorMessage = '';
  isSubmitting = false;
  redirectTo = '/home';

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
      return;
    }

    const redirect = this.route.snapshot.queryParamMap.get('redirectTo');
    if (redirect && redirect.startsWith('/')) {
      this.redirectTo = redirect;
    }
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { name, email, password } = this.form.getRawValue();

    this.authService
      .register({
        name: name ?? '',
        email: email ?? '',
        password: password ?? ''
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigateByUrl(this.redirectTo);
        },
        error: (error: Error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || 'Unable to create account';
        }
      });
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control) => {
      const password = control.get('password')?.value;
      const confirm = control.get('confirmPassword')?.value;

      if (password && confirm && password !== confirm) {
        return { mismatch: true };
      }

      return null;
    };
  }
}
