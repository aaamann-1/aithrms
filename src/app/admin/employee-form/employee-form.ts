import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm {

  employeeForm = {
    title: 'Mr.',
    employeeName: '',
    fatherName: '',
    motherName: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: '',
    phoneNumber: '',
    mobileNumber: '',
    personalEmail: '',
    nationality: '',
    maritalStatus: 'Single',
    spouseName: '',
    aadhaarNumber: '',
    panNumber: '',
    religion: 'Hindu',

    currentAddress: '',
    currentCountry: '',
    currentState: '',
    currentCity: '',
    currentPincode: '',

    permanentAddress: '',
    permanentCountry: '',
    permanentState: '',
    permanentCity: '',
    permanentPincode: '',

    emergencyContact: '',
    emergencyMobile: '',
    emergencyRelation: ''
  };

  constructor(private router: Router) {}

  // =========================
  // BACK TO EMPLOYEE LIST
  // =========================

  goBack() {
    this.router.navigate(['/admin/employee']);
  }

  // =========================
  // SAVE EMPLOYEE
  // =========================

  saveEmployee() {

    const existingEmployees = JSON.parse(
      localStorage.getItem('employees') || '[]'
    );

    const newEmployee = {
      ...this.employeeForm,
      name: this.employeeForm.employeeName,
      email: this.employeeForm.personalEmail
    };

    existingEmployees.push(newEmployee);

    localStorage.setItem(
      'employees',
      JSON.stringify(existingEmployees)
    );

    console.log('Employee saved:', newEmployee);

    this.router.navigate(['/admin/employee']);
  }

  // =========================
  // COPY CURRENT ADDRESS
  // =========================

  copyCurrentAddress() {

    this.employeeForm.permanentAddress =
      this.employeeForm.currentAddress;

    this.employeeForm.permanentCountry =
      this.employeeForm.currentCountry;

    this.employeeForm.permanentState =
      this.employeeForm.currentState;

    this.employeeForm.permanentCity =
      this.employeeForm.currentCity;

    this.employeeForm.permanentPincode =
      this.employeeForm.currentPincode;
  }
}