import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
export interface EmployeeData {
  id: number;

  title: string;
  name: string;
  email: string;
  designation: string;
  status: 'Active' | 'Inactive';

  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  phoneNumber: string;
  mobileNumber: string;
  personalEmail: string;
  nationality: string;
  maritalStatus: string;
  spouseName: string;
  aadhaarNumber: string;
  panNumber: string;
  religion: string;

  currentAddress1: string;
  currentAddress2: string;
  currentAddress3: string;
  currentCountry: string;
  currentState: string;
  currentCity: string;
  currentPincode: string;

  permanentAddress1: string;
  permanentAddress2: string;
  permanentAddress3: string;
  permanentCountry: string;
  permanentState: string;
  permanentCity: string;
  permanentPincode: string;

  emergencyContact: string;
  emergencyMobile: string;
  emergencyRelation: string;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})
export class Employee implements OnInit {

  employees: EmployeeData[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  // =========================
  // LOAD EMPLOYEES
  // =========================

  loadEmployees(): void {
    this.employees = JSON.parse(
      localStorage.getItem('employees') || '[]'
    );
  }

  // =========================
  // OPEN NEW EMPLOYEE FORM
  // =========================

  openForm() {
  localStorage.removeItem('editingEmployee');
  this.router.navigate(['/admin/employee/new']);
}

  // =========================
  // EDIT EMPLOYEE
  // =========================

  editEmployee(employee: EmployeeData) {
  localStorage.setItem('editingEmployee', JSON.stringify(employee));
  this.router.navigate(['/admin/employee/new']);
}



  // =========================
  // VIEW EMPLOYEE
  // =========================

  selectedEmployee: EmployeeData | null = null;
showView = false;

viewEmployee(employee: EmployeeData) {
  this.selectedEmployee = employee;
  this.showView = true;
}

closeView() {
  this.showView = false;
  this.selectedEmployee = null;
}

  // =========================
  // DELETE EMPLOYEE
  // =========================

  deleteEmployee(employee: EmployeeData): void {

    const confirmed = confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.employees = this.employees.filter(
      item => item.id !== employee.id
    );

    localStorage.setItem(
      'employees',
      JSON.stringify(this.employees)
    );

    alert('Employee deleted successfully.');
  }
}