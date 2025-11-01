import { Routes } from "@angular/router";
import { EmployeesList } from "./components/employees-list/employees-list";
import { authGuard } from "../../core/gaurds/auth-guard";
import { hrGuard } from "../../core/gaurds/hr-guard";

//childern Routes
export const employeeRoutes: Routes = [
    {
        path: "",
        component: EmployeesList,
        title: "Employees List"
    },
    {
        path: "register",
        loadComponent: () => import("./components/register-employee/register-employee").then(re =>re.RegisterEmployee),
        title: 'Register New Event',
        // canActivate: [authGuard, hrGuard]
    },
    // {
    //     path: ":id",
    //     loadComponent: () => import("./components/employee-details/employee-details").then(ed => ed.EventDetails),
    //     title: "Events Deetails",
    //     data: { companyName: 'Bajaj Pvt. Ltd.', role: 'Employee' },
    //     canActivate: [authGuard]
    // }

];