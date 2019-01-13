import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService,ConfigService } from './_services';
import { User, DemoUsecase, DemoConfigHolder } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;
    demoConfigHolder:DemoConfigHolder;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private configService:ConfigService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.configService.selectedDemoConfigSubject.subscribe(demoConfigHolder=>{
            this.demoConfigHolder = demoConfigHolder;
        })
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}