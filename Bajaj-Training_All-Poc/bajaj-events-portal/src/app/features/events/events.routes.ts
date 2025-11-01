import { Routes } from "@angular/router";
import { EventsList } from "./components/events-list/events-list";
import { authGuard } from "../../core/gaurds/auth-guard";
import { hrGuard } from "../../core/gaurds/hr-guard";
//childern Routes
export const eventRoutes:Routes=[
    {
        path:"",
        component:EventsList,
        title:"Events List",
        canActivate:[authGuard] //gauard
    },
    {
        path:"register",
        loadComponent:()=>import("./components/register-event/register-event").then(re=>re.RegisterEvent),
        title:'Register New Event',
        canActivate:[authGuard,hrGuard]
    },
    {
        path:":id",
        loadComponent:()=>import("./components/event-details/event-details").then(ed=>ed.EventDetails),
        title:"Events Deetails",
        data:{companyName:'Bajaj Pvt. Ltd.', role:'Employee'},
        canActivate:[authGuard]
    }

];