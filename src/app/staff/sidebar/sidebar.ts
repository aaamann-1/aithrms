import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() collapsed = false;

  constructor(private router: Router) {}

  goTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  logout(): void {
    this.router.navigateByUrl('/login');
  }
}