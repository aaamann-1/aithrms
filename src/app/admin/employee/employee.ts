import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})
export class Employee {

  employees: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {

    const savedEmployees = localStorage.getItem('employees');

    if (savedEmployees) {
      this.employees = JSON.parse(savedEmployees);
    }
  }

  openForm() {
    this.router.navigate(['/admin/employee/new']);
  }
}