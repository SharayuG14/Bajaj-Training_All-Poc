import { Component } from '@angular/core';
import { Banner } from "../../shared/components/banner/banner";
import { Slider } from '../../shared/components/slider/slider';
import { ProductsList } from '../products/components/products-list/products-list';

@Component({
  selector: 'bajaj-home',
  standalone: true,
  imports: [Banner, Slider, ProductsList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
