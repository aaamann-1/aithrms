import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.css'
})
export class StaffManagement {

  addStaff(): void {
    console.log('Add Staff button clicked');

    // Later you can navigate to the Add Staff page
    // or open an Add Staff modal here.
  }

}