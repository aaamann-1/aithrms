import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm implements OnInit {
  isEditMode = false;
  editingEmployeeId: number | null = null;

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
    nationality: 'Indian',
    maritalStatus: 'Single',
    spouseName: '',
    aadhaarNumber: '',
    panNumber: '',
    religion: '',
    designation: '',
    department: '',
    joiningDate: '',

    currentAddress1: '',
    currentAddress2: '',
    currentCountry: '',
    currentState: '',
    currentCity: '',
    currentPincode: '',

    permanentAddress1: '',
    permanentAddress2: '',
    permanentCountry: '',
    permanentState: '',
    permanentCity: '',
    permanentPincode: '',

    emergencyContact: '',
    emergencyMobile: '',
    emergencyRelation: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const editingEmployee = localStorage.getItem('editingEmployee');

    if (!editingEmployee) {
      return;
    }

    try {
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
        personalEmail: employee.personalEmail || employee.email || '',
        nationality: employee.nationality || 'Indian',
        maritalStatus: employee.maritalStatus || 'Single',
        spouseName: employee.spouseName || '',
        aadhaarNumber: employee.aadhaarNumber || '',
        panNumber: employee.panNumber || '',
        religion: employee.religion || '',
        designation: employee.designation || '',
        department: employee.department || '',
        joiningDate: employee.joiningDate || '',

        currentAddress1: employee.currentAddress1 || '',
        currentAddress2: employee.currentAddress2 || '',
        currentCountry: employee.currentCountry || '',
        currentState: employee.currentState || '',
        currentCity: employee.currentCity || '',
        currentPincode: employee.currentPincode || '',

        permanentAddress1: employee.permanentAddress1 || '',
        permanentAddress2: employee.permanentAddress2 || '',
        permanentCountry: employee.permanentCountry || '',
        permanentState: employee.permanentState || '',
        permanentCity: employee.permanentCity || '',
        permanentPincode: employee.permanentPincode || '',

        emergencyContact: employee.emergencyContact || '',
        emergencyMobile: employee.emergencyMobile || '',
        emergencyRelation: employee.emergencyRelation || ''
      };
    } catch (error) {
      console.error('Error loading employee data:', error);
      alert('Unable to load employee data.');
      localStorage.removeItem('editingEmployee');
    }
  }

  goBack(): void {
    localStorage.removeItem('editingEmployee');
    this.router.navigate(['/admin/employee']);
  }

  saveEmployee(): void {
    if (!this.employeeForm.employeeName.trim()) {
      alert('Please enter Employee Name.');
      return;
    }

    if (!this.employeeForm.gender.trim()) {
      alert('Please select Gender.');
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
      alert('Please select Designation.');
      return;
    }

    if (!this.employeeForm.department.trim()) {
      alert('Please select Department.');
      return;
    }

    if (!this.employeeForm.joiningDate.trim()) {
      alert('Please select Joining Date.');
      return;
    }

    const optionalValue = (value: string): string | null => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    };

    let employees: any[];

    try {
      employees = JSON.parse(localStorage.getItem('employees') || '[]');

      if (!Array.isArray(employees)) {
        employees = [];
      }
    } catch {
      employees = [];
    }

    const savedEmployee = {
      ...(this.isEditMode
        ? employees.find(
            employee => employee.id === this.editingEmployeeId
          ) || {}
        : {}),

      id: this.isEditMode && this.editingEmployeeId !== null
        ? this.editingEmployeeId
        : Date.now(),

      title: this.employeeForm.title,
      name: this.employeeForm.employeeName.trim(),
      email: this.employeeForm.personalEmail.trim(),
      designation: this.employeeForm.designation,
      department: this.employeeForm.department,
      status: 'Active',

      fatherName: optionalValue(this.employeeForm.fatherName),
      motherName: optionalValue(this.employeeForm.motherName),
      gender: this.employeeForm.gender,
      dateOfBirth: optionalValue(this.employeeForm.dateOfBirth),
      bloodGroup: optionalValue(this.employeeForm.bloodGroup),
      phoneNumber: optionalValue(this.employeeForm.phoneNumber),
      mobileNumber: this.employeeForm.mobileNumber.trim(),
      personalEmail: this.employeeForm.personalEmail.trim(),
      nationality: optionalValue(this.employeeForm.nationality),
      maritalStatus: optionalValue(this.employeeForm.maritalStatus),
      spouseName: optionalValue(this.employeeForm.spouseName),
      aadhaarNumber: optionalValue(this.employeeForm.aadhaarNumber),
      panNumber: optionalValue(this.employeeForm.panNumber),
      religion: optionalValue(this.employeeForm.religion),
      joiningDate: this.employeeForm.joiningDate,

      currentAddress1: optionalValue(this.employeeForm.currentAddress1),
      currentAddress2: optionalValue(this.employeeForm.currentAddress2),
      currentAddress3: '',
      currentCountry: optionalValue(this.employeeForm.currentCountry),
      currentState: optionalValue(this.employeeForm.currentState),
      currentCity: optionalValue(this.employeeForm.currentCity),
      currentPincode: optionalValue(this.employeeForm.currentPincode),

      permanentAddress1: optionalValue(this.employeeForm.permanentAddress1),
      permanentAddress2: optionalValue(this.employeeForm.permanentAddress2),
      permanentAddress3: '',
      permanentCountry: optionalValue(this.employeeForm.permanentCountry),
      permanentState: optionalValue(this.employeeForm.permanentState),
      permanentCity: optionalValue(this.employeeForm.permanentCity),
      permanentPincode: optionalValue(this.employeeForm.permanentPincode),

      emergencyContact: optionalValue(this.employeeForm.emergencyContact),
      emergencyMobile: optionalValue(this.employeeForm.emergencyMobile),
      emergencyRelation: optionalValue(this.employeeForm.emergencyRelation)
    };

    if (this.isEditMode) {
      const index = employees.findIndex(
        employee => employee.id === this.editingEmployeeId
      );

      if (index >= 0) {
        employees[index] = savedEmployee;
      } else {
        employees.push(savedEmployee);
      }
    } else {
      employees.push(savedEmployee);
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.removeItem('editingEmployee');

    alert(
      this.isEditMode
        ? 'Employee updated successfully.'
        : 'Employee saved successfully.'
    );

    this.router.navigate(['/admin/employee']);
  }

  copyCurrentAddress(): void {
    this.employeeForm.permanentAddress1 =
      this.employeeForm.currentAddress1;
    this.employeeForm.permanentAddress2 =
      this.employeeForm.currentAddress2;
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