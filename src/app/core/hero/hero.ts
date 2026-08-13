import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {

  showDemoModal = false;

  demoSubmitted = false;

  demoName = '';
  demoEmail = '';
  demoMobile = '';
  demoEmployeeSize = '';

  openDemoModal(): void {
    this.showDemoModal = true;
  }

  closeDemoModal(): void {
    this.showDemoModal = false;
  }

  submitDemo(): void {

    if (
      !this.demoName ||
      !this.demoEmail ||
      !this.demoMobile ||
      !this.demoEmployeeSize
    ) {
      alert('Please fill all the details.');
      return;
    }

    this.demoSubmitted = true;

    console.log('Demo Request:', {
      name: this.demoName,
      email: this.demoEmail,
      mobile: this.demoMobile,
      employeeSize: this.demoEmployeeSize
    });

    // Close popup if it is open
    this.showDemoModal = false;

    alert('Demo request submitted successfully!');

    // Clear form
    this.demoName = '';
    this.demoEmail = '';
    this.demoMobile = '';
    this.demoEmployeeSize = '';
  }

}