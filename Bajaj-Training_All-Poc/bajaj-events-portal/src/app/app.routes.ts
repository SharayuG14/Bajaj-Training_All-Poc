import { Routes } from "@angular/router";
import { EpHome } from "./features/home/ep-home/ep-home";
import { Employee } from "./features/employees/models/employee";
import { EmployeesList } from "./features/employees/components/employees-list/employees-list";
import { EventsList } from "./features/events/components/events-list/events-list";
import { ResourceNotFound } from "./shared/components/resource-not-found/resource-not-found";
import { Login } from "./features/security/components/login/login";
import { authGuard } from "./core/gaurds/auth-guard";
import { EmployeeForbiddenAccess } from "./shared/components/employee-forbidden-access/employee-forbidden-access";
import { hrGuard } from "./core/gaurds/hr-guard";
import { eventRoutes } from "./features/events/events.routes";
import { employeeRoutes } from "./features/employees/employees.routes";
import { SecurityRoutes } from "./features/security/security.routes";

export const routes:Routes=[
    {
        path:"",
        component:EpHome,
        title:"Bajaj EP Home"
    },
    {
        path:"home",
        component:EpHome,
        title:"Bajaj EP Home"
    },
    {
        path:"employees",
        children:[...employeeRoutes]
    },
    {
        path:"events",
        children:[...eventRoutes]

    },
    {
        path:"auth",
        children:[...SecurityRoutes]
    },
    {
        path:"forbidden-access",
        component:EmployeeForbiddenAccess,
        title:"Access Denied"
    },
    {
        path:"**",
        component:ResourceNotFound,
        title:"Not-Fount - 404"
    }
   

];