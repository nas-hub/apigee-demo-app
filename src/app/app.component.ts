import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService,ConfigService } from './_services';
import { User, DemoUsecase, DemoConfigHolder } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html',styleUrls: ['app.component.css'] })
export class AppComponent {
    currentUser: User;
    demoConfigHolder:DemoConfigHolder;
    apigeeSite:boolean = true;
    bgImage:string = "https://live-hl-apigeecom.devportal.apigee.com/sites/default/files/2018-09/homepage-hero_0.png";
   // logoImage:string = "https://d3an9kf42ylj3p.cloudfront.net/uploads/2015/03/ag.png";
   logoImage:string = "https://apigee.com/about/cdn/farfuture/FE506IITCjlxVqmw5JlXuT1MuZJn38RrTnu1yCkT0eo/mtime:1439316357/sites/mktg-new/files/community_icon.png";
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private configService:ConfigService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.configService.selectedDemoConfigSubject.subscribe(demoConfigHolder=>{
            this.demoConfigHolder = demoConfigHolder;
            let demoConfigBgImage = this.demoConfigHolder.configItems.find(configItem => configItem.key == "bgImage");
            let demoConfigLogoImage = this.demoConfigHolder.configItems.find(configItem => configItem.key == "logoImage");
            if(demoConfigBgImage && demoConfigBgImage.value && demoConfigBgImage.value.length>2){
                this.bgImage = demoConfigBgImage.value;
            }
            if(demoConfigLogoImage && demoConfigLogoImage.value && demoConfigLogoImage.value.length>2){
                this.logoImage = demoConfigLogoImage.value;
            }
            
        });
        if((window.location.origin.indexOf("apigee") == -1) && (window.location.origin.indexOf("localhost") == -1)){
            this.apigeeSite = false;
        }
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}