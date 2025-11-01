import { Component, inject } from '@angular/core';
import { EmployeeApi } from '../../services/employee-api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeRegistration } from '../../models/employee-registration';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './register-employee.html',
  styleUrl: './register-employee.css',
})
export class RegisterEmployee {
  private _employeesApi = inject(EmployeeApi);
  private _router = inject(Router);
  private _employeesApiSubscription: Subscription;
  protected title: string = "Register New Bajaj Employee!";
  protected fb = new FormBuilder();
  protected register: EmployeeRegistration = new EmployeeRegistration(this.fb);

  protected onEmployeeSubmit(): void {
    this._employeesApiSubscription = this._employeesApi.scheduleNewEmployee(this.register.employeeForm.value).subscribe({
      next: data => {
        if (data.acknowledged === true) {
          this._router.navigate(['/employees']);
        }
      }
    });
  }
  ngOnDestroy(): void {
    if (this._employeesApiSubscription) {
      this._employeesApiSubscription.unsubscribe();
    }
  }
}
