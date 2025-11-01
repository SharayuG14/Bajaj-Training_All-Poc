import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bajaj-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrls: ['./banner.css']
})
export class Banner {
  banners = [
    {
      img: 'assets/images/down2.jpeg',
      title: 'Top Deals on Electronics',
      desc: 'Grab the latest gadgets at unbeatable prices!',
      btn: 'Shop Now'
    },
    {
      img: 'assets/images/download.jpeg',
      title: 'Fashion Fiesta',
      desc: 'Discover trending styles and amazing discounts.',
      btn: 'Explore'
    },
    {
      img: 'assets/images/down.jpeg',
      title: 'Home Essentials',
      desc: 'Make your home smart and comfortable.',
      btn: 'See More'
    },
    {
      img: 'assets/images/44.jpg',
      title: 'Daily Needs',
      desc: 'Stock up on groceries and daily essentials.',
      btn: 'Buy Now'
    }
  ];
}
