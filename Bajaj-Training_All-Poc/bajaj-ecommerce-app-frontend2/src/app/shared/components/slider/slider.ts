// import { Component } from '@angular/core';

// @Component({
//   selector: 'bajaj-slider',
//   imports: [],
//   templateUrl: './slider.html',
//   styleUrl: './slider.css',
// })
// export class Slider {

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bajaj-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.html',
  styleUrls: ['./slider.css']
})
export class Slider {
  slides = [
    { img: 'assets/images/slider1.jpg', title: 'Slide 1' },
    { img: 'assets/images/slider2.jpg', title: 'Slide 2' },
    { img: 'assets/images/slider3.jpg', title: 'Slide 3' },
  ];  
}

