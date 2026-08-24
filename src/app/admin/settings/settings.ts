import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

  fullName: string = 'Dev Sharma';
  email: string = 'dev.sharma@dsrpanel.com';
  phone: string = '+91 98765 43210';
  role: string = 'Administrator';

  pushNotifications: boolean = true;
  autoExport: boolean = false;
  liveActivity: boolean = true;
  darkMode: boolean = false;


  changePhoto(): void {
    alert('Change Photo clicked');
  }


  saveChanges(): void {
    alert('Profile changes saved successfully!');
  }


  changePassword(): void {
    alert('Change Password clicked');
  }


  twoFactorAuthentication(): void {
    alert('Two-Factor Authentication clicked');
  }

}