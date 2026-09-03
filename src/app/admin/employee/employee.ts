import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})
export class Employee {

  showForm = false;

  employees = [
    {
      name: 'Rahul Sharma',
      email: 'rahul@example.com'
    },
    {
      name: 'Priya Nair',
      email: 'priya@example.com'
    }
  ];

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  createEmployee() {
    console.log('Employee created');
    this.showForm = false;
  }
}