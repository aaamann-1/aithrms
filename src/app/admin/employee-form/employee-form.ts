import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  // =========================
  // EDIT MODE
  // =========================

  isEditMode = false;

  editingEmployeeId: number | null = null;


  // =========================
  // EMPLOYEE FORM
  // =========================

  employeeForm = {

    // PERSONAL

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

    // CURRENT ADDRESS

    currentAddress1: '',
    currentAddress2: '',
    currentAddress3: '',
    currentCountry: '',
    currentState: '',
    currentCity: '',
    currentPincode: '',

    // PERMANENT ADDRESS

    permanentAddress1: '',
    permanentAddress2: '',
    permanentAddress3: '',
    permanentCountry: '',
    permanentState: '',
    permanentCity: '',
    permanentPincode: '',

    // EMERGENCY

    emergencyContact: '',
    emergencyMobile: '',
    emergencyRelation: ''
  };


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


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
        employeeName: employee.name || employee.employeeName || '',
        fatherName: employee.fatherName || '',
        motherName: employee.motherName || '',
        gender: employee.gender || 'Male',
        dateOfBirth: employee.dateOfBirth || '',
        bloodGroup: employee.bloodGroup || '',
        phoneNumber: employee.phoneNumber || '',
        mobileNumber: employee.mobileNumber || '',
        personalEmail:
          employee.personalEmail ||
          employee.email ||
          '',
        nationality:
          employee.nationality ||
          'Indian',
        maritalStatus:
          employee.maritalStatus ||
          'Single',
        spouseName:
          employee.spouseName ||
          '',
        aadhaarNumber:
          employee.aadhaarNumber ||
          '',
        panNumber:
          employee.panNumber ||
          '',
        religion:
          employee.religion ||
          'Hindu',
        designation:
          employee.designation ||
          '',

        currentAddress1:
          employee.currentAddress1 ||
          '',
        currentAddress2:
          employee.currentAddress2 ||
          '',
        currentAddress3:
          employee.currentAddress3 ||
          '',
        currentCountry:
          employee.currentCountry ||
          '',
        currentState:
          employee.currentState ||
          '',
        currentCity:
          employee.currentCity ||
          '',
        currentPincode:
          employee.currentPincode ||
          '',

        permanentAddress1:
          employee.permanentAddress1 ||
          '',
        permanentAddress2:
          employee.permanentAddress2 ||
          '',
        permanentAddress3:
          employee.permanentAddress3 ||
          '',
        permanentCountry:
          employee.permanentCountry ||
          '',
        permanentState:
          employee.permanentState ||
          '',
        permanentCity:
          employee.permanentCity ||
          '',
        permanentPincode:
          employee.permanentPincode ||
          '',

        emergencyContact:
          employee.emergencyContact ||
          '',
        emergencyMobile:
          employee.emergencyMobile ||
          '',
        emergencyRelation:
          employee.emergencyRelation ||
          ''
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
  // SAVE EMPLOYEE
  // =========================

  saveEmployee(): void {

    // -------------------------
    // VALIDATION
    // -------------------------

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


    // -------------------------
    // CREATE REQUEST
    // -------------------------

    const request = {

      title:
        this.employeeForm.title,

      employeeName:
        this.employeeForm.employeeName,

      fatherName:
        this.employeeForm.fatherName,

      motherName:
        this.employeeForm.motherName,

      gender:
        this.employeeForm.gender,

      dateOfBirth:
        this.employeeForm.dateOfBirth,

      bloodGroup:
        this.employeeForm.bloodGroup,

      mobileNumber:
        this.employeeForm.mobileNumber,

      personalEmail:
        this.employeeForm.personalEmail,

      nationality:
        this.employeeForm.nationality,

      maritalStatus:
        this.employeeForm.maritalStatus,

      spouseName:
        this.employeeForm.spouseName,

      aadhaarNumber:
        this.employeeForm.aadhaarNumber,

      panNumber:
        this.employeeForm.panNumber,

      religion:
        this.employeeForm.religion,


      // -------------------------
      // CURRENT ADDRESS
      // -------------------------

      currentAddress: [

        this.employeeForm.currentAddress1,

        this.employeeForm.currentAddress2,

        this.employeeForm.currentAddress3

      ]
        .filter(value => value)
        .join(', '),

      currentCountry:
        this.employeeForm.currentCountry,

      currentState:
        this.employeeForm.currentState,

      currentCity:
        this.employeeForm.currentCity,

      currentPincode:
        this.employeeForm.currentPincode,


      // -------------------------
      // PERMANENT ADDRESS
      // -------------------------

      permanentAddress: [

        this.employeeForm.permanentAddress1,

        this.employeeForm.permanentAddress2,

        this.employeeForm.permanentAddress3

      ]
        .filter(value => value)
        .join(', '),

      permanentCountry:
        this.employeeForm.permanentCountry,

      permanentState:
        this.employeeForm.permanentState,

      permanentCity:
        this.employeeForm.permanentCity,

      permanentPincode:
        this.employeeForm.permanentPincode,


      // -------------------------
      // EMERGENCY
      // -------------------------

      emergencyContact:
        this.employeeForm.emergencyContact,

      emergencyMobile:
        this.employeeForm.emergencyMobile,

      emergencyRelation:
        this.employeeForm.emergencyRelation
    };


    // =========================
    // SEND TO BACKEND
    // =========================

    this.http.post(

      'http://localhost:5089/api/Employee',

      request

    )
    .subscribe({

      // =========================
      // SUCCESS
      // =========================

      next: (response: any) => {

        console.log(
          'Employee saved successfully:',
          response
        );


        alert(
          'Employee saved successfully.'
        );


        localStorage.removeItem(
          'editingEmployee'
        );


        this.router.navigate(
          ['/admin/employee']
        );
      },


      // =========================
      // ERROR
      // =========================

      error: (error) => {

        console.error(
          'Employee save error:',
          error
        );


        const message =
          error?.error?.message ||
          'Failed to save employee.';


        alert(message);
      }

    });
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