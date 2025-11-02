import { Component, signal } from '@angular/core';
import { Navbar } from "./shared/components/nav-bar/nav-bar";
import { Footer } from "./shared/components/footer/footer";
import { Header } from './shared/components/header/header';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'bajaj-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('bajaj-ecommerce-app');
}
