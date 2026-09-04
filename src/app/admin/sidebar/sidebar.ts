import { Component, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
collapsed = input(false);
  constructor(private router: Router) {}

  logout(): void {

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    this.router.navigate(['/login']);
  }

}