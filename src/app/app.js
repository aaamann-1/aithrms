import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
let App = class App {
};
App = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterOutlet],
        templateUrl: './app.html',
        styleUrl: './app.css',
    })
], App);
export { App };
