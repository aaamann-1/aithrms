import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
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
  mobileNumber: string;
  personalEmail: string;
  nationality: string;
  maritalStatus: string;
  spouseName: string;
  aadhaarNumber: string;
  panNumber: string;
  religion: string;

  currentAddress: string;
  currentCountry: string;
  currentState: string;
  currentCity: string;
  currentPincode: string;

  permanentAddress: string;
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

  selectedEmployee: EmployeeData | null = null;
  showView = false;

  constructor(
  private router: Router,
  private employeeService: EmployeeService,
  private changeDetector: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadEmployees();
  }
loadEmployees(): void {
  this.employeeService.getEmployees().subscribe({
    next: (apiEmployees: any[]) => {
      console.log('Staff received from API:', apiEmployees);

      this.employees = apiEmployees.map((employee: any) => ({
        id: employee.id,

        title: employee.title || '',
        name: employee.employeeName || employee.fullName || 'Unknown',
        email: employee.personalEmail || employee.username || '',
        designation: employee.designation || 'Not added',
        status: employee.status || 'Active',

        fatherName: employee.fatherName || '',
        motherName: employee.motherName || '',
        gender: employee.gender || '',
        dateOfBirth: employee.dateOfBirth || '',
        bloodGroup: employee.bloodGroup || '',
        mobileNumber: employee.mobileNumber || '',
        personalEmail: employee.personalEmail || '',
        nationality: employee.nationality || '',
        maritalStatus: employee.maritalStatus || '',
        spouseName: employee.spouseName || '',
        aadhaarNumber: employee.aadhaarNumber || '',
        panNumber: employee.panNumber || '',
        religion: employee.religion || '',

        currentAddress: employee.currentAddress || '',
        currentCountry: employee.currentCountry || '',
        currentState: employee.currentState || '',
        currentCity: employee.currentCity || '',
        currentPincode: employee.currentPincode || '',

        permanentAddress: employee.permanentAddress || '',
        permanentCountry: employee.permanentCountry || '',
        permanentState: employee.permanentState || '',
        permanentCity: employee.permanentCity || '',
        permanentPincode: employee.permanentPincode || '',

        emergencyContact: employee.emergencyContact || '',
        emergencyMobile: employee.emergencyMobile || '',
        emergencyRelation: employee.emergencyRelation || ''
      }));

      console.log('Employees shown in page:', this.employees);
      this.changeDetector.detectChanges();
    },

    error: (error) => {
      console.error('Could not load employees:', error);
      alert('Could not load employee data.');
    }
  });
}
  openForm(): void {
    this.router.navigate(['/admin/employee/new']);
  }

  editEmployee(employee: EmployeeData): void {
    // We will connect this to a real update API next.
    this.router.navigate(['/admin/employee/new'], {
      queryParams: { id: employee.id }
    });
  }

  viewEmployee(employee: EmployeeData): void {
    this.selectedEmployee = employee;
    this.showView = true;
  }

  closeView(): void {
    this.showView = false;
    this.selectedEmployee = null;
  }

  deleteEmployee(employee: EmployeeData): void {
    const confirmed = confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        alert('Employee deleted successfully.');
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Could not delete employee:', error);
        alert(error.error?.message || 'Could not delete employee.');
      }
    });
  }
}