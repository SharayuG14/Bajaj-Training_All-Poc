import { Routes } from "@angular/router";
import { EventsList } from "./components/events-list/events-list";
import { hrGuard } from "../../core/guards/hr-guard";
import { authGuard } from "../../core/guards/auth-guard";
//Children routes
export const eventRoutes:Routes=[
    {
        path:"",
        component:EventsList,
        title:"Events List",
        canActivate:[authGuard] 
    },
    {
        path:"register",
        loadComponent:()=>import("./components/register-event/register-event").then(re=>re.RegisterEvent),title:'Register New Event',
        canActivate:[authGuard,hrGuard]
    },
    {
        path:":id",
        loadComponent:()=>import("./components/event-details/event-details").then(ed=>ed.EventDetails),
        title:"Event Details",
        data:{companyName:'Bajaj Pvt. Ltd.',role:'Employee'},
        canActivate:[authGuard] 
    }
];