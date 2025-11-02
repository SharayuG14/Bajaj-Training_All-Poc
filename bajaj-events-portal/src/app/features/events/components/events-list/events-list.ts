import { Component, EventEmitter, Input, Output,inject,OnInit } from '@angular/core';

import { Event } from "../../models/event";
// import { Event } from '@angular/router';
import { EventDetails} from '../event-details/event-details';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
// import { NgxPaginationModule } from 'ngx-pagination';
import { EventsApi } from "../../service/events-api";
import { SortPipe } from '../../../../shared/pipes/sort-pipe';
import { Subscription } from 'rxjs';
import { DateGlobalizationPipe } from '../../../../shared/pipes/date-globalization-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { LowercaseTruncPipe } from '../../../../shared/pipes/lowercase-trunc-pipe';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-events-list',
  imports: [CommonModule, DateGlobalizationPipe,
    LowercaseTruncPipe, FormsModule, NgxPaginationModule, SortPipe, RouterLink],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css'
})
export class EventsList {
  
  ngOnInit():void{
    this.role=localStorage.getItem('role');
    if(this.role==='Employee'){
      this.columns = this.columns.filter(col=>col!=="Cancel Event");
    }
    this._eventservicesubscription =this.eventApi.getAllEvents().subscribe({
      next:eventData=>{
        console.log(eventData);
        this.events=eventData;
        this.filteredEvents = [...this.events] ;
      },error:err=>{
        console.log(err);
      }
    });
    
  }
  private _eventservicesubscription:Subscription;
  private eventApi=inject(EventsApi);
  protected title:string="Welcome To Bajaj Finserv Events Lists ";
  protected subTitle:string="Published by Bajaj Finserv Hr Department";
  // protected selectedEvent:Event;
   protected selectedEventId:number;
  protected childMessage:string;
  protected childSubTitle:string="Details of selected events";
  protected searchChars:string="";
  protected pageNumber:number=1;
  protected pageSize:number=2;
  protected storedPage:number=0;
  protected role:string|null;


  protected columns:string[]=["Event Code","Event Name","Start Date","Fees","Show Details","Cancel Event"];
  protected events:Event[];
  protected filteredEvents :Event[];

  protected handleChildMessage(message:string):void{
        this.childMessage=message;
    }
  // protected onEventSelection(id:number):void{
  //       this.selectedEventId=id;
        
  //   }
    
    protected isSearching: boolean = false; // Track if a search is active
  protected previousPageNumber: number = 1; // Store page before search

  protected searchEvents(): void {
    const searchText = this.searchChars?.trim().toLowerCase();

    if (searchText) {
      if (!this.isSearching) {
        this.previousPageNumber = this.pageNumber;
        this.isSearching = true;
      }

      this.pageNumber = 1;

      this.filteredEvents = this.events.filter((event) =>
        event.eventName.toLowerCase().includes(searchText)
      );
    } else {
      this.filteredEvents = this.events;
      this.pageNumber = this.previousPageNumber;
      this.isSearching = false;
    }
  }


  protected sortColumn: string = 'eventName';
protected sortDirection: 'asc' | 'desc' = 'asc';

protected toggleSort(column: string): void {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
}


ngOnDestroy():void{
  if(this._eventservicesubscription){
    this._eventservicesubscription.unsubscribe();
  }
}

}

