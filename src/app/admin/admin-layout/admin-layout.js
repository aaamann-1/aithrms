import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';
let AdminLayout = class AdminLayout {
    sidebarCollapsed = false;
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }
};
AdminLayout = __decorate([
    Component({
        selector: 'app-admin-layout',
        standalone: true,
        imports: [
            RouterOutlet,
            SidebarComponent,
            AdminNavbarComponent
        ],
        templateUrl: './admin-layout.html',
        styleUrl: './admin-layout.css'
    })
], AdminLayout);
export { AdminLayout };
