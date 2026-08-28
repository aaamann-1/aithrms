import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
let ExportReports = class ExportReports {
};
ExportReports = __decorate([
    Component({
        selector: 'app-export-reports',
        standalone: true,
        imports: [
            RouterLink,
            RouterLinkActive
        ],
        templateUrl: './export-reports.html',
        styleUrl: './export-reports.css'
    })
], ExportReports);
export { ExportReports };
