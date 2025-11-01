import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export class EmployeeRegistration {
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      employeeId: [0, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      employeeName: ['Your Name', [Validators.required]],
      address: [''],
      city: [''],
      zipcode: ['', [Validators.minLength(6), Validators.maxLength(6)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.email]],
      skillSets: [''],
      country: [''],
      joiningDate: ['']
    });
  }   
}



//  employeeId: 2374,
//     employeeName: 'Alisha C.',
//     address: 'Mooncity, B8/404',
//     city: 'Mumbai',
//     zipcode: 510512,
//     phone: '+91 30003000',
//     email: 'alisha.c@synechron.com',
//     skillSets: 'Java',
//     country: 'India',
//     joiningDate: ISODate('2025-10-24T09:21:00.190Z'),
//     avatar: 'images/noimage.png'