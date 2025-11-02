import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth-guard";
import { EmployeesList } from "./components/employees-list/employees-list";
//Children routes
export const employeeRoutes:Routes=[
    {
        path:"",
        component:EmployeesList,
        title:"Employees List",
        canActivate:[authGuard]  
    },
    {
        path:"register",
        loadComponent:()=>import("./components/register-employee/register-employee").then(re=>re.RegisterEmployee),
        title:'Register New Employee',
        canActivate:[authGuard]
    },
];