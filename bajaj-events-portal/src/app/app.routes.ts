import { Routes } from "@angular/router";
import { EpHome } from "./features/home/ep-home/ep-home";
import { EmployeesList } from "./features/employees/components/employees-list/employees-list";
import { EventsList } from "./features/events/components/events-list/events-list";
import { ResourceNotFound } from "./shared/components/resource-not-found/resource-not-found";
import { Login } from "./features/security/components/login/login";
import { authGuard } from "./core/guards/auth-guard";

import { eventRoutes } from "./features/events/events.routes";
import { EmployeeForbiddenAccess } from "./shared/components/employee-forbidden-access/employee-forbidden-access";
import { SecurityRoutes } from "./features/security/security.routes";
import { employeeRoutes } from "./features/employees/employees.routes";
export const routes:Routes=[
    {
        path:"",
        component:EpHome,
        title:"Bajaj Ep Home"
    },
    {
        path:"events",
        children:[
            ...eventRoutes
        ]
    },{
        path:"employees",
        children:[
            ...employeeRoutes
        ]
    },{
        path:'auth',
        children:[
            ...SecurityRoutes]

    },

    {
        path:"home",
        component:EpHome,
        title:"Bajaj Ep Home"
    },
 
    
    {
        path:"login",
        component:Login,
        title:'Login'
    },
    {
        path:'forbidden-access',
        component:EmployeeForbiddenAccess,
        title:'Forbidden Access'

    },
    {
        path:"**",
        component:ResourceNotFound,
        title:"Not Found - 404"
    },
    
];