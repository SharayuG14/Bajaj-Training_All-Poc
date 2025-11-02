import { Component, Input,Output,EventEmitter,inject,OnChanges,OnDestroy, SimpleChanges } from '@angular/core';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { EmployeeApi } from "../../services/employee-api";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnChanges,OnDestroy {


  protected title:string="Details of -";
  @Input() public employeeId:number;
  protected employee:Employee;
  @Input() public subtitle:string;
  @Output() sendConfirmationMessage: EventEmitter<string>=new EventEmitter<string>();


  private _employeeApi =inject(EmployeeApi);
  private _employeesApisubscription:Subscription;

  protected onEventProcessed():void{
  //this will fire an event to send data to parent component
  this.sendConfirmationMessage.emit(`event ${this.employee.employeeName} has been processed and stored in oracle db`)
}

ngOnChanges(changes: SimpleChanges): void {
  console.log(changes);
  this._employeesApisubscription =  this._employeeApi.getEmployeeDetails(this.employeeId).subscribe({
      next:data=>{
        this.employee =data;
      },error:err=>{
        console.log(err);
      }
    })
  }
  ngOnDestroy(): void {
    this._employeesApisubscription.unsubscribe();
  }



}
