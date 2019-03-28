import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AlertService, AuthenticationService ,ConfigService} from '@app/_services';
import {DemoUsecase,Lookup, DemoUsecaseFactory,DemoConfigHolder} from '@app/_models';

@Component({templateUrl: 'login.component.html',styleUrls: ['login.component.css']})
export class LoginComponent implements OnInit {
    loading = false;
    submitted = false;
    returnUrl: string;
    selectedUsecase:DemoConfigHolder;
    wellknownConfigEndpointConfigItemPresent:boolean = false;
    response:any;
    responseCode:string;
    

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private configService: ConfigService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        
        this.selectedUsecase = this.configService.getCurrentSelectedDemoConfig();

        let wellknownConfigEndpointConfigItem = this.selectedUsecase.configItems.find(configItem => configItem.key == "wellknownConfigEndpoint");

            if(wellknownConfigEndpointConfigItem && wellknownConfigEndpointConfigItem.value && wellknownConfigEndpointConfigItem.value.length>2){
                this.wellknownConfigEndpointConfigItemPresent = true;
            }

        if(this.route.snapshot.queryParams['access_token']){
            this.authenticationService.loginWithToken(this.route.snapshot.queryParams['access_token'],this.route.snapshot.queryParams['name'],this.route.snapshot.queryParams['email']);
            this.router.navigate(['/']);
        }
        
    }

    performLogin() {
      this.selectedUsecase = this.configService.getCurrentSelectedDemoConfig();
      let hostName = window.location.hostname;
      if(window.location.port){
          if(window.location.port.length > 2){
              hostName = hostName+":"+window.location.port;
          }
      }
      switch(this.selectedUsecase.usecaseId){
          case DemoUsecaseFactory.pattern_1A_OIDC: case DemoUsecaseFactory.pattern_1B_OIDC: case DemoUsecaseFactory.pattern_1A_SAML: case DemoUsecaseFactory.pattern_3A_OIDC:{
            window.open('https://'+Lookup.byId("hostName", this.selectedUsecase)+Lookup.byId("tokenURI", this.selectedUsecase)+'?client_id='+Lookup.byId("clientId", this.selectedUsecase)+'&target='+window.location.protocol+'//'+hostName+'/login', '_self');  
            break;
          }
          case DemoUsecaseFactory.pattern_4A_CC:{
            this.authenticationService.getToken().subscribe(
                (res) => {
                    this.authenticationService.loginWithToken(res["access_token"],"","This is an App Account.");
                    console.log("Login Success  "+ JSON.stringify(res));
                    this.router.navigate(['/']);
                },
                err => this.alertService.error("Failed to get the token: "+err)
            );
            break;
          }

          default:{
            this.alertService.error("Usecase with ID :"+this.selectedUsecase.usecaseId+" Is not supported in the App, please fill in the feature request form.");
          }
      }
      
    }


    getOIDInfo(){
        console.log("Invoking Token Info API");
        this.loading = true;
        this.authenticationService.getOIDCInfo().subscribe(data=>{
            console.log(data);
            this.response =  data;
            this.loading = false;
        },err => {
            this.handleError(err);
            this.response = err;
            this.alertService.error("Failed to get the token information: "+err.statusText);
            this.loading = false;
        });
}

private handleError(error: HttpErrorResponse) {
    console.error(JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
  };

}
