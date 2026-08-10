import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Navbar } from '../../core/navbar/navbar';
import { Hero } from '../../core/hero/hero';
import { Features } from '../../core/features/features';
import { InfoBanner } from '../../core/info-banner/info-banner';
import { Footer } from '../../core/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Hero,
    Features,
    InfoBanner,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}