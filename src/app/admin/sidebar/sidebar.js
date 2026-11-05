import { __decorate } from "tslib";
import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
let SidebarComponent = class SidebarComponent {
    router;
    collapsed = input(false);
    constructor(router) {
        this.router = router;
    }
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
};
SidebarComponent = __decorate([
    Component({
        selector: 'app-sidebar',
        standalone: true,
        imports: [
            RouterLink,
            RouterLinkActive
        ],
        templateUrl: './sidebar.html',
        styleUrl: './sidebar.css'
    })
], SidebarComponent);
export { SidebarComponent };
