import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';

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
  isSaving = false;
  isLoading = false;

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

 constructor(
  private router: Router,
  private employeeService: EmployeeService,
  private cdr: ChangeDetectorRef
) {}

  // Convert API date values into HTML date-input format
  private formatDate(value: any): string {
    if (!value) {
      return '';
    }

    return String(value).substring(0, 10);
  }

  // Load existing employee details from backend
  ngOnInit(): void {

    const editingEmployee = localStorage.getItem('editingEmployee');

    console.log('Editing employee from localStorage:', editingEmployee);

    if (!editingEmployee) {
      console.log('No employee selected. Opening new employee form.');
      return;
    }

    try {

      const employee = JSON.parse(editingEmployee);

      console.log('Employee selected for editing:', employee);

      const employeeId = Number(
        employee.id ?? employee.employeeId
      );

      console.log('Employee ID:', employeeId);

      if (!employeeId || Number.isNaN(employeeId)) {

        alert('Invalid employee ID. Please select the employee again.');

        localStorage.removeItem('editingEmployee');

        this.router.navigate(['/admin/employee']);

        return;
      }

      this.isEditMode = true;
      this.editingEmployeeId = employeeId;
      this.isLoading = true;

      console.log(
        'Requesting employee details from API:',
        `http://localhost:5089/api/Employee/${employeeId}`
      );

      this.employeeService.getEmployee(employeeId).subscribe({

        next: (response: any) => {

          this.isLoading = false;

          console.log('Employee details received from API:', response);

          // Handle both direct object and wrapped API responses
          const data = response?.data ?? response?.employee ?? response;

          if (!data || typeof data !== 'object') {

            console.error('Invalid employee response:', response);

            alert('Employee details were not returned correctly.');

            return;
          }

          this.employeeForm = {

            title: data.title || 'Mr.',

            employeeName: data.employeeName || data.name || '',

            fatherName: data.fatherName || '',
            motherName: data.motherName || '',

            gender: data.gender || 'Male',

            dateOfBirth: this.formatDate(data.dateOfBirth),

            bloodGroup: data.bloodGroup || '',

            phoneNumber: data.phoneNumber || '',

            mobileNumber: data.mobileNumber || '',

            personalEmail: data.personalEmail || data.email || '',

            nationality: data.nationality || 'Indian',

            maritalStatus: data.maritalStatus || 'Single',

            spouseName: data.spouseName || '',

            aadhaarNumber: data.aadhaarNumber || '',

            panNumber: data.panNumber || '',

            religion: data.religion || '',

            designation: data.designation || '',

            department: data.department || '',

            joiningDate: this.formatDate(data.joiningDate),

            currentAddress1: data.currentAddress || '',

            currentAddress2: '',

            currentCountry: data.currentCountry || '',

            currentState: data.currentState || '',

            currentCity: data.currentCity || '',

            currentPincode: data.currentPincode || '',

            permanentAddress1: data.permanentAddress || '',

            permanentAddress2: '',

            permanentCountry: data.permanentCountry || '',

            permanentState: data.permanentState || '',

            permanentCity: data.permanentCity || '',

            permanentPincode: data.permanentPincode || '',

            emergencyContact: data.emergencyContact || '',

            emergencyMobile: data.emergencyMobile || '',

            emergencyRelation: data.emergencyRelation || ''

          };

          console.log('Employee form populated:', this.employeeForm);
this.cdr.detectChanges();
        },

        error: (error: any) => {

          this.isLoading = false;

          console.error('Employee loading error:', error);

          console.error('API error response:', error.error);

          alert(
            error.error?.message ||
            error.error?.title ||
            'Unable to load employee details. Please check the employee ID and API.'
          );

        }

      });

    } catch (error) {

      console.error('Error reading employee data:', error);

      alert('Unable to read employee data.');

      localStorage.removeItem('editingEmployee');

    }

  }

  // Go back to employee management
  goBack(): void {

    localStorage.removeItem('editingEmployee');

    this.router.navigate(['/admin/employee']);

  }

  // Save new employee or update existing employee
  saveEmployee(): void {

    if (this.isSaving || this.isLoading) {
      return;
    }

    // Validate employee name
    if (!this.employeeForm.employeeName.trim()) {
      alert('Please enter Employee Name.');
      return;
    }

    // Validate title
    if (!this.employeeForm.title.trim()) {
      alert('Please select Title.');
      return;
    }

    // Validate gender
    if (!this.employeeForm.gender.trim()) {
      alert('Please select Gender.');
      return;
    }

    // Validate mobile number
    if (!this.employeeForm.mobileNumber.trim()) {
      alert('Please enter Mobile Number.');
      return;
    }

    // Validate email
    if (!this.employeeForm.personalEmail.trim()) {
      alert('Please enter Personal Email ID.');
      return;
    }

    // Validate designation
    if (!this.employeeForm.designation.trim()) {
      alert('Please select Designation.');
      return;
    }

    // Validate department
    if (!this.employeeForm.department.trim()) {
      alert('Please select Department.');
      return;
    }

    // Validate joining date
    if (!this.employeeForm.joiningDate.trim()) {
      alert('Please select Joining Date.');
      return;
    }

    // Convert empty optional values into null
    const optionalValue = (value: string): string | null => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    };

    // Combine address lines
    const currentAddress = [
      this.employeeForm.currentAddress1,
      this.employeeForm.currentAddress2
    ]
      .map(value => value.trim())
      .filter(value => value.length > 0)
      .join(', ');

    const permanentAddress = [
      this.employeeForm.permanentAddress1,
      this.employeeForm.permanentAddress2
    ]
      .map(value => value.trim())
      .filter(value => value.length > 0)
      .join(', ');

    // Prepare data for backend
    const employeeData = {

      title: this.employeeForm.title.trim(),

      employeeName: this.employeeForm.employeeName.trim(),

      fatherName: optionalValue(this.employeeForm.fatherName),

      motherName: optionalValue(this.employeeForm.motherName),

      gender: this.employeeForm.gender,

      dateOfBirth: optionalValue(this.employeeForm.dateOfBirth),

      bloodGroup: optionalValue(this.employeeForm.bloodGroup),

      mobileNumber: this.employeeForm.mobileNumber.trim(),

      personalEmail: this.employeeForm.personalEmail.trim(),

      nationality: optionalValue(this.employeeForm.nationality),

      maritalStatus: optionalValue(this.employeeForm.maritalStatus),

      spouseName: optionalValue(this.employeeForm.spouseName),

      aadhaarNumber: optionalValue(this.employeeForm.aadhaarNumber),

      panNumber: optionalValue(this.employeeForm.panNumber),

      religion: optionalValue(this.employeeForm.religion),

      designation: this.employeeForm.designation,

      department: this.employeeForm.department,

      joiningDate: this.employeeForm.joiningDate,

      currentAddress: currentAddress || null,

      currentCountry: optionalValue(this.employeeForm.currentCountry),

      currentState: optionalValue(this.employeeForm.currentState),

      currentCity: optionalValue(this.employeeForm.currentCity),

      currentPincode: optionalValue(this.employeeForm.currentPincode),

      permanentAddress: permanentAddress || null,

      permanentCountry: optionalValue(this.employeeForm.permanentCountry),

      permanentState: optionalValue(this.employeeForm.permanentState),

      permanentCity: optionalValue(this.employeeForm.permanentCity),

      permanentPincode: optionalValue(this.employeeForm.permanentPincode),

      emergencyContact: optionalValue(this.employeeForm.emergencyContact),

      emergencyMobile: optionalValue(this.employeeForm.emergencyMobile),

      emergencyRelation: optionalValue(this.employeeForm.emergencyRelation)

    };

    this.isSaving = true;

    console.log('Employee data being saved:', employeeData);

    // UPDATE existing employee
    if (this.isEditMode && this.editingEmployeeId !== null) {

      console.log('Updating employee ID:', this.editingEmployeeId);

      this.employeeService.updateEmployee(
        this.editingEmployeeId,
        employeeData
      ).subscribe({

        next: (response: any) => {

          this.isSaving = false;

          localStorage.removeItem('editingEmployee');

          alert(response.message || 'Employee updated successfully!');

          this.router.navigate(['/admin/employee']);

        },

        error: (error: any) => {

          this.isSaving = false;

          console.error('Employee update error:', error);

          const errorMessage =
            error.error?.message ||
            error.error?.title ||
            'Unable to update employee. Please check the server and try again.';

          alert(errorMessage);

        }

      });

      return;
    }

    // CREATE new employee
    this.employeeService.createEmployee(employeeData).subscribe({

      next: (response: any) => {

        this.isSaving = false;

        localStorage.removeItem('editingEmployee');

        alert(
          'Employee saved successfully!\n\n' +
          'Username: ' + response.loginUsername + '\n' +
          'Password: ' + response.defaultPassword + '\n' +
          'Role: ' + response.role
        );

        this.router.navigate(['/admin/employee']);

      },

      error: (error: any) => {

        this.isSaving = false;

        console.error('Employee save error:', error);

        const errorMessage =
          error.error?.message ||
          error.error?.title ||
          'Unable to save employee. Please check the server and try again.';

        alert(errorMessage);

      }

    });

  }

  // Copy current address to permanent address
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
