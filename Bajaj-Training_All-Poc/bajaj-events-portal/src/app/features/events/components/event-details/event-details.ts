// import { Component,input,Input ,Output,EventEmitter, output,inject, OnChanges, OnDestroy, SimpleChanges,OnInit } from '@angular/core';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Event } from "../../models/event";
import { CommonModule } from '@angular/common';
import { EventsApi } from "../../services/events-api";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-event-details',
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails implements OnInit, OnDestroy {


  protected title: string = "Details of -";
  //  @Input() public eventId:number;
  protected event: Event;
  private _activatedRoute=inject(ActivatedRoute);
  // @Input() public subtitle:string;
  // @Output() sendConfirmationMessage: EventEmitter<string>=new EventEmitter<string>();

  private _eventsApi = inject(EventsApi);
  private _eventsApisubscription: Subscription;

  // protected onEventProcessed():void{
  //   //this will fire an event to send data to parent component
  //   this.sendConfirmationMessage.emit(`event ${this.event.eventName} has been processed and stored in oracle db`)
  // }

  ngOnInit(): void {
    let eventId= this._activatedRoute.snapshot.params['id'];
    this._activatedRoute.data.subscribe({
      next:data=>{
        console.log(data);
      }
    });
    this._eventsApisubscription = this._eventsApi.getEventDetails(eventId).subscribe({
      next: data => {
        this.event = data;
      }, error: err => {
        console.log(err);
      }
    })
  }
  
  ngOnDestroy(): void {
    this._eventsApisubscription.unsubscribe();
  }
}
