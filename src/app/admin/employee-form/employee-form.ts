import { Component, OnInit } from '@angular/core';
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
export class EmployeeForm implements OnInit {

  isEditMode = false;

  editingEmployeeId: number | null = null;

  employeeForm = {

    // =========================
    // PERSONAL
    // =========================

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
    nationality: 'Indian',
    maritalStatus: 'Single',
    spouseName: '',
    aadhaarNumber: '',
    panNumber: '',
    religion: 'Hindu',
    designation: '',

    // =========================
    // CURRENT ADDRESS
    // =========================

    currentAddress1: '',
    currentAddress2: '',
    currentAddress3: '',
    currentCountry: '',
    currentState: '',
    currentCity: '',
    currentPincode: '',

    // =========================
    // PERMANENT ADDRESS
    // =========================

    permanentAddress1: '',
    permanentAddress2: '',
    permanentAddress3: '',
    permanentCountry: '',
    permanentState: '',
    permanentCity: '',
    permanentPincode: '',

    // =========================
    // EMERGENCY
    // =========================

    emergencyContact: '',
    emergencyMobile: '',
    emergencyRelation: ''
  };


  constructor(private router: Router) {}


  // =========================
  // INITIALIZE
  // =========================

  ngOnInit(): void {

    const editingEmployee =
      localStorage.getItem('editingEmployee');

    if (editingEmployee) {

      const employee = JSON.parse(editingEmployee);

      this.isEditMode = true;

      this.editingEmployeeId = employee.id;

      this.employeeForm = {

        title: employee.title || 'Mr.',
        employeeName: employee.name || '',
        fatherName: employee.fatherName || '',
        motherName: employee.motherName || '',
        gender: employee.gender || 'Male',
        dateOfBirth: employee.dateOfBirth || '',
        bloodGroup: employee.bloodGroup || '',
        phoneNumber: employee.phoneNumber || '',
        mobileNumber: employee.mobileNumber || '',
        personalEmail: employee.personalEmail || employee.email || '',
        nationality: employee.nationality || 'Indian',
        maritalStatus: employee.maritalStatus || 'Single',
        spouseName: employee.spouseName || '',
        aadhaarNumber: employee.aadhaarNumber || '',
        panNumber: employee.panNumber || '',
        religion: employee.religion || 'Hindu',
        designation: employee.designation || '',

        currentAddress1: employee.currentAddress1 || '',
        currentAddress2: employee.currentAddress2 || '',
        currentAddress3: employee.currentAddress3 || '',
        currentCountry: employee.currentCountry || '',
        currentState: employee.currentState || '',
        currentCity: employee.currentCity || '',
        currentPincode: employee.currentPincode || '',

        permanentAddress1: employee.permanentAddress1 || '',
        permanentAddress2: employee.permanentAddress2 || '',
        permanentAddress3: employee.permanentAddress3 || '',
        permanentCountry: employee.permanentCountry || '',
        permanentState: employee.permanentState || '',
        permanentCity: employee.permanentCity || '',
        permanentPincode: employee.permanentPincode || '',

        emergencyContact: employee.emergencyContact || '',
        emergencyMobile: employee.emergencyMobile || '',
        emergencyRelation: employee.emergencyRelation || ''
      };
    }
  }


  // =========================
  // BACK
  // =========================

  goBack(): void {

    localStorage.removeItem('editingEmployee');

    this.router.navigate(['/admin/employee']);
  }


  // =========================
  // SAVE / UPDATE
  // =========================

  saveEmployee(): void {

    if (!this.employeeForm.employeeName.trim()) {

      alert('Please enter Employee Name.');

      return;
    }


    if (!this.employeeForm.mobileNumber.trim()) {

      alert('Please enter Mobile Number.');

      return;
    }


    if (!this.employeeForm.personalEmail.trim()) {

      alert('Please enter Personal Email ID.');

      return;
    }


    if (!this.employeeForm.designation.trim()) {

      alert('Please enter Designation.');

      return;
    }


    const existingEmployees =
      JSON.parse(
        localStorage.getItem('employees') || '[]'
      );


    // =========================
    // UPDATE
    // =========================

    if (this.isEditMode && this.editingEmployeeId !== null) {

      const index =
        existingEmployees.findIndex(
          (employee: any) =>
            employee.id === this.editingEmployeeId
        );


      if (index !== -1) {

        existingEmployees[index] = {

          ...existingEmployees[index],

          ...this.employeeForm,

          id: this.editingEmployeeId,

          name: this.employeeForm.employeeName,

          email: this.employeeForm.personalEmail,

          status:
            existingEmployees[index].status || 'Active'
        };
      }


      localStorage.setItem(
        'employees',
        JSON.stringify(existingEmployees)
      );


      localStorage.removeItem('editingEmployee');

      alert('Employee updated successfully.');

    }


    // =========================
    // CREATE
    // =========================

    else {

      const newEmployee = {

        id: Date.now(),

        ...this.employeeForm,

        name: this.employeeForm.employeeName,

        email: this.employeeForm.personalEmail,

        status: 'Active'
      };


      existingEmployees.push(newEmployee);


      localStorage.setItem(
        'employees',
        JSON.stringify(existingEmployees)
      );


      alert('Employee added successfully.');
    }


    this.router.navigate(['/admin/employee']);
  }


  // =========================
  // COPY CURRENT ADDRESS
  // =========================

  copyCurrentAddress(): void {

    this.employeeForm.permanentAddress1 =
      this.employeeForm.currentAddress1;

    this.employeeForm.permanentAddress2 =
      this.employeeForm.currentAddress2;

    this.employeeForm.permanentAddress3 =
      this.employeeForm.currentAddress3;

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