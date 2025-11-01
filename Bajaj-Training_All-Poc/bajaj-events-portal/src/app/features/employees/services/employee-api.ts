import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Employee } from "../models/employee";
import { CudResponse } from '../../../shared/models/cud-response';

@Injectable({
   providedIn: 'root'
})
export class EmployeeApi {
   private _httpclient = inject(HttpClient);
   private _baseUrl: string = "http://192.168.1.32:9090/api";
   public getAllEmployees(): Observable<Employee[]> {
      return this._httpclient.get<Employee[]>(`${this._baseUrl}/employees`)
   }
   public getEventDetails(EmployeeId: number): Observable<Employee> {
      return this._httpclient.get<Employee>(`${this._baseUrl}/employees/${EmployeeId}`)
   }
   public scheduleNewEmployee(employee:Employee):Observable<CudResponse>{
         return this._httpclient.post<CudResponse>(`${this._baseUrl}/employees`,employee);
       }
}
