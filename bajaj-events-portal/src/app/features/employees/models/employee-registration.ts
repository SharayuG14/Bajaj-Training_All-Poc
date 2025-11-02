import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../shared/validation/custom-validation';


export class EmployeeRegistration {
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      employeeId: ['', [Validators.required, CustomValidation.employeeIdValidator()]],
      employeeName: ['', [Validators.required, CustomValidation.employeeNameValidator()]],
      address: [''],
      city: [''],
      zipcode: ['', [Validators.required, CustomValidation.zipcodeValidator()]],
      phone: ['', [Validators.required, CustomValidation.phoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
      skillSets: [''],
      country: [''],
      joiningDate: ['', [Validators.required, CustomValidation.joiningDateValidator()]],
      avatar: ['']
    });
  }
}