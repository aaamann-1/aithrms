import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
let Navbar = class Navbar {
};
Navbar = __decorate([
    Component({
        selector: 'app-navbar',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './navbar.html',
        styleUrl: './navbar.css'
    })
], Navbar);
export { Navbar };
