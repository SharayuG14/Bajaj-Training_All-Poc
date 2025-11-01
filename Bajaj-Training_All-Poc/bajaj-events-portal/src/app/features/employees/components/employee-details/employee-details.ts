import { Component, Input, Output, EventEmitter, inject, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Employee } from '../../models/employee';
import { Subscription } from "rxjs";
import { EmployeeApi } from "../../services/employee-api";
@Component({
  selector: 'app-employee-details',
  imports: [],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnChanges, OnDestroy {

  protected title: string = "Details of -";
  @Input() public empId: number;
  protected employee: Employee;
  @Input() public subtitle: string;
  @Output() sendConfirmationMessage: EventEmitter<string> = new EventEmitter<string>();


  protected onEventProcessed(): void {
    //this will fire an event to send data to parent component
    this.sendConfirmationMessage.emit(`event ${this.employee.employeeName} has been processed and stored in oracle db`);
  }

  private _employeeApi = inject(EmployeeApi);
  private _EmployeeApisubscription: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this._EmployeeApisubscription = this._employeeApi.getEventDetails(this.empId).subscribe({
      next: data => {
        console.log(data);
        this.employee = data;
      }, error: err => {
        console.log(err);
      }
    })
  }
  ngOnDestroy(): void {
    this._EmployeeApisubscription.unsubscribe();
  }
}
