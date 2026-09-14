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
<<<<<<< Updated upstream
  selectedRole = 'Staff';
=======
  selectedRole = 'staff';
>>>>>>> Stashed changes

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
<<<<<<< Updated upstream
    if (
      !this.username ||
      !this.contactNumber ||
      !this.password ||
      !this.selectedRole
    ) {
      alert('Please enter username, contact number, password, and role.');
      return;
    }

=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======

        
       if (response.role === 'Admin') {
  this.router.navigate(['/admin']);
} else {
  this.router.navigate(['/staff']);
}
      },


     error: (error: any) => {
      console.log(error);
    alert(error.error?.message || 'Login failed. Check your details and role.');
  
}
>>>>>>> Stashed changes
    });
  }
}