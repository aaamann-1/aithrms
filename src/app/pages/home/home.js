import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../core/navbar/navbar';
import { Hero } from '../../core/hero/hero';
import { Features } from '../../core/features/features';
import { InfoBanner } from '../../core/info-banner/info-banner';
import { Footer } from '../../core/footer/footer';
let Home = class Home {
};
Home = __decorate([
    Component({
        selector: 'app-home',
        standalone: true,
        imports: [
            CommonModule,
            Navbar,
            Hero,
            Features,
            InfoBanner,
            Footer
        ],
        templateUrl: './home.html',
        styleUrl: './home.css'
    })
], Home);
export { Home };
