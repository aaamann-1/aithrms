import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let Sidebar = class Sidebar {
    router;
    collapsed = false;
    constructor(router) {
        this.router = router;
    }
    goTo(path) {
        this.router.navigateByUrl(path);
    }
    logout() {
        this.router.navigateByUrl('/login');
    }
};
__decorate([
    Input()
], Sidebar.prototype, "collapsed", void 0);
Sidebar = __decorate([
    Component({
        selector: 'app-staff-sidebar',
        standalone: true,
        imports: [],
        templateUrl: './sidebar.html',
        styleUrl: './sidebar.css'
    })
], Sidebar);
export { Sidebar };
