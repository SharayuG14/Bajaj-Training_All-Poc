import { Component, inject ,OnInit} from '@angular/core';
import { Employee } from '../../models/employee';
import { EmployeeDetails } from "../employee-details/employee-details";
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import {EmployeeApi  } from "../../services/employee-api";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-employees-list',
    templateUrl: './employees-list.html',
    styleUrl: './employees-list.css',
    imports: [CommonModule,EmployeeDetails,FormsModule,NgxPaginationModule,RouterModule]
})
export class EmployeesList {



  ngOnInit():void{

    this._employeeservicesubscription =this.employeeApi.getAllEmployees().subscribe({
      next:employeeData=>{
        console.log(employeeData);
        this.Employee=employeeData;
        this.filteredEmployee = [...this.Employee] ;
      },error:err=>{
        console.log(err);
      }
    });
  }
    private _employeeservicesubscription:Subscription;
    private employeeApi=inject(EmployeeApi);
    protected title: string = "Welcome To Bajaj Finserv Employee Lists ";
    protected subTitle: string = "Published by Bajaj Finserv Hr Department";
    // protected selectedEmployee: Employee;
    protected selectedEmployeeId:number;
    protected childMessage: string;
    protected childSubTitle: string = "Details of selected events";
    protected searchChars:string="";
    protected pageNumber:number=1;
    protected pageSize:number=2;


    protected columns: string[] = ["Employee Name", "Employee City", "Employee Phone", "Employee Email", "Show Details"];
    protected Employee: Employee[];
    protected filteredEmployee :Employee[];
    
    protected handleChildMessage(message: string): void {
        this.childMessage = message;
    }
    protected onEmployeeSelection(id:number): void {
        this.selectedEmployeeId = id;
    }

    protected isSearching: boolean = false; // Track if a search is active
  protected previousPageNumber: number = 1; // Store page before search
   protected searchEmployee(): void {
        
    const searchText = this.searchChars?.trim().toLowerCase();

    if (searchText) {
      if (!this.isSearching) {
        this.previousPageNumber = this.pageNumber;
        this.isSearching = true;
      }

      this.pageNumber = 1;

      this.filteredEmployee = this.Employee.filter((emp) =>
        emp.employeeName.toLowerCase().includes(searchText)
      );
    } else {
      this.filteredEmployee = this.Employee;
      this.pageNumber = this.previousPageNumber;
      this.isSearching = false;
    }
  
      }
      
      ngOnDestroy():void{
  if(this._employeeservicesubscription){
    this._employeeservicesubscription.unsubscribe();
  }
}

      
}
