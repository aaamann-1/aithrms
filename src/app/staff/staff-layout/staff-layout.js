import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
let StaffLayout = class StaffLayout {
    sidebarCollapsed = false;
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }
};
StaffLayout = __decorate([
    Component({
        selector: 'app-staff-layout',
        standalone: true,
        imports: [
            RouterOutlet,
            Sidebar,
            Navbar
        ],
        templateUrl: './staff-layout.html',
        styleUrl: './staff-layout.css'
    })
], StaffLayout);
export { StaffLayout };
