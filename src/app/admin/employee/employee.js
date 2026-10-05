import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let Employee = class Employee {
    router;
    employeeService;
    changeDetector;
    employees = [];
    selectedEmployee = null;
    showView = false;
    constructor(router, employeeService, changeDetector) {
        this.router = router;
        this.employeeService = employeeService;
        this.changeDetector = changeDetector;
    }
    ngOnInit() {
        this.loadEmployees();
    }
    loadEmployees() {
        this.employeeService.getEmployees().subscribe({
            next: (apiEmployees) => {
                console.log('Staff received from API:', apiEmployees);
                this.employees = apiEmployees.map((employee) => ({
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
    openForm() {
        this.router.navigate(['/admin/employee/new']);
    }
    editEmployee(employee) {
        // We will connect this to a real update API next.
        this.router.navigate(['/admin/employee/new'], {
            queryParams: { id: employee.id }
        });
    }
    viewEmployee(employee) {
        this.selectedEmployee = employee;
        this.showView = true;
    }
    closeView() {
        this.showView = false;
        this.selectedEmployee = null;
    }
    deleteEmployee(employee) {
        const confirmed = confirm(`Are you sure you want to delete ${employee.name}?`);
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
};
Employee = __decorate([
    Component({
        selector: 'app-employee',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './employee.html',
        styleUrl: './employee.css'
    })
], Employee);
export { Employee };
