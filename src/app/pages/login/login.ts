import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  contactNumber = '';
  password = '';
  selectedRole = 'Staff';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (
      !this.username ||
      !this.contactNumber ||
      !this.password ||
      !this.selectedRole
    ) {
      alert('Please enter username, contact number, password, and role.');
      return;
    }

    const loginData = {
      username: this.username,
      contactNumber: this.contactNumber,
      password: this.password,
      role: this.selectedRole
    };

    this.authService.login(loginData).subscribe({


     next: (response: any) => {

  localStorage.setItem('token', response.token);
  localStorage.setItem('role', response.role);
localStorage.setItem('fullName', response.fullName);
localStorage.setItem('username', response.username);
localStorage.setItem('contactNumber', response.contactNumber);

if (response.role === 'Staff') {
  localStorage.setItem('employeeId', response.employeeId?.toString() ?? '');
  localStorage.setItem('department', response.department ?? '');
  localStorage.setItem('designation', response.designation ?? '');
  localStorage.setItem('joiningDate', response.joiningDate ?? '');
}


  // Save logged-in user's profile information
  const currentUser = {
    username: response.username,
    fullName: response.fullName,
    contactNumber: response.contactNumber,
    role: response.role
  };

  localStorage.setItem(
    'currentUser',
    JSON.stringify(currentUser)
  );

  if (response.role === 'Admin') {
    this.router.navigate(['/admin']);
  } else {
    this.router.navigate(['/staff']);
  }
},



      error: (error: any) => {
        console.log(error);

        alert(
          error.error?.message ||
          'Login failed. Check your details and role.'
        );
      }
    });
  }
}