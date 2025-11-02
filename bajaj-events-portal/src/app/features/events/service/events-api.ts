import { Injectable,inject } from '@angular/core';
import { Event } from "../models/event";

import { HttpClient } from "@angular/common/http";
import {Observable  } from "rxjs";
import { CudResponse } from '../../../shared/models/cud-response';

@Injectable({
  providedIn: 'root'
})
export class EventsApi {

    private _httpclient =inject(HttpClient);
    private baseUrl:string="http://192.168.1.33:9090/api";
    public getAllEvents():Observable<Event[]>{
       return this._httpclient.get<Event[]>(`${this.baseUrl}/events`) 
    }
    public getEventDetails(Eventid:number):Observable<Event>{
       return this._httpclient.get<Event>(`${this.baseUrl}/events/${Eventid}`) 
    }

    public scheduleNewEvent(event:Event):Observable<CudResponse>{
      return this._httpclient.post<CudResponse>(`${this.baseUrl}/events`,event);
    }
}


// @Injectable( {
//   providedIn: 'root'
// })
// export class EventsApi {
//   private events:Event[]=[
//         {
//             eventId: 1001,
//             eventCode: 'SEMJQ3',
//             eventName: 'Seminar on jQuery 3.x',
//             description: 'Seminar will discuss all the new features of jQuery 3.x',
//             startDate: new Date(),
//             endDate: new Date(),
//             fees: 800,
//             seatsFilled: 70,
//             logo: 'images/ng1.jpg'
//         },
//         {
//             eventId: 1002,
//             eventCode: 'SEMNG1',
//             eventName: 'Seminar on Angular JS 1.5.x',
//             description: 'Seminar will discuss all the new features of Angular JS 1.5.x',
//             startDate: new Date(),
//             endDate: new Date(),
//             fees: 600,
//             seatsFilled: 50,
//             logo: 'images/ng2.jpg'
//         },
//         {
//             eventId: 1003,
//             eventCode: 'SEMNG2',
//             eventName: 'Seminar on Angular 2.x',
//             description: 'Seminar will discuss all the new features of Angular 2.x',
//             startDate: new Date(),
//             endDate: new Date(),
//             fees: 1000,
//             seatsFilled: 80,
//             logo: 'images/ng3.jpg'
//         },
//         {
//             eventId: 1004,
//             eventCode: 'SEMNG4',
//             eventName: 'Seminar on Angular 4.x',
//             description: 'Seminar will discuss all the new features of Angular 4.x',
//             startDate: new Date(),
//             endDate: new Date(),
//             fees: 1000,
//             seatsFilled: 76,
//             logo: 'images/ng4.jpg'
//         },
//         {
//             eventId: 1005,
//             eventCode: 'SEMBS3',
//             eventName: 'Seminar on Bootstrap 3.x',
//             description: 'Seminar will discuss all the new features of Bootstrap 3.x',
//             startDate: new Date(),
//             endDate: new Date(),
//             fees: 500,
//             seatsFilled: 34,
//             logo: 'images/ng1.jpg'
//         }
//     ];
// public getAllEvents():Event[]{
//   return this.events;
// }

// }


