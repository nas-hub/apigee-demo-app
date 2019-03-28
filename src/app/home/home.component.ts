import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { User,DemoUsecase, DemoConfigHolder,Lookup } from '@app/_models';
import { UserService,ConfigService, AuthenticationService , AlertService} from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    response:any;
    responseCode:string;
    loading:boolean = false;
    selectedDemoUsecase:DemoConfigHolder;
    introspectToken:string;
    hasIntrospectToken:boolean;
    invokeProtectedApi:string;
    hasInvokeProtectedApi:boolean;
    invokeProtectedApiNoAccess:string;
    hasInvokeProtectedApiNoAccess:boolean;
    welcomeMessage:string;
    resetActions(){
        this.introspectToken ="Introspect Token";
        this.hasIntrospectToken = false;
        this.hasInvokeProtectedApi = false;
        this.hasInvokeProtectedApiNoAccess = false;
        this.invokeProtectedApi ="Invoke Protected API";
        this.invokeProtectedApiNoAccess ="Invoke No Access API";
    }

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private configService:ConfigService,
        private alertService:AlertService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            if(this.currentUser.firstName && this.currentUser.firstName.length>1){
                this.welcomeMessage = "Welcome "+this.currentUser.firstName+"!";
            }else{
                this.welcomeMessage = "";
            }
            console.log("The Logged in user is "+JSON.stringify(this.currentUser));
        });
        this.configService.selectedDemoConfigSubject.subscribe(demoUsecase =>{
            this.selectedDemoUsecase = demoUsecase;  
            this.resetActions();

            let tokenInfoURIConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "tokenInfoURI");
            let protectedApiURIConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "protectedApiURI");
            let noAccessApiURIConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "noAccessApiURI");
            let tokenInfoCaptionConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "tokenInfoCaption");
            let protectedApiCaptionConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "protectedApiCaption");
            let noAccessApiCaptionConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "noAccessApiCaption");

            if(tokenInfoURIConfigItem && tokenInfoURIConfigItem.value && tokenInfoURIConfigItem.value.length>2){
                this.hasIntrospectToken = true;
                if(tokenInfoCaptionConfigItem && tokenInfoCaptionConfigItem.value && tokenInfoCaptionConfigItem.value.length>1){
                    this.introspectToken = tokenInfoCaptionConfigItem.value;
                } 
            }
            if(protectedApiURIConfigItem && protectedApiURIConfigItem.value && protectedApiURIConfigItem.value.length>1){
                this.hasInvokeProtectedApi = true;
                if(protectedApiCaptionConfigItem && protectedApiCaptionConfigItem.value && protectedApiCaptionConfigItem.value.length>1){
                    this.invokeProtectedApi = protectedApiCaptionConfigItem.value;
                } 
            }
            
            if(noAccessApiURIConfigItem && noAccessApiURIConfigItem.value && noAccessApiURIConfigItem.value.length>1){
                this.hasInvokeProtectedApiNoAccess = true;
                if(noAccessApiCaptionConfigItem && noAccessApiCaptionConfigItem.value && noAccessApiCaptionConfigItem.value.length>1){
                    this.invokeProtectedApiNoAccess = noAccessApiCaptionConfigItem.value;
                } 
            }

            
        });
    }

    idpLogout(){
        window.open(Lookup.byId("idpLogoutEndpoint",this.selectedDemoUsecase), '_blank');  
    }

    noAccessAPI(){
        console.log("Invoking noAccessAPI API");
        this.loading = true;
            this.authenticationService.noAccessAPI().subscribe(data=>{
                console.log(data);
                this.response =  data;
                this.loading = false;
            },err => {
                this.handleError(err);
                this.response = err;
                this.alertService.error("Failed to invoke API: "+err.statusText);
                this.loading = false;
            });
    }

    protectedAPI(){
        console.log("Invoking Protected API");
        this.loading = true;
            this.authenticationService.protectedAPI().subscribe(data=>{
                console.log(data);
                this.response =  data;
                this.loading = false;
            },err => {
                this.handleError(err);
                this.response = err;
                this.alertService.error("Failed to invoke API: "+err.statusText);
                this.loading = false;
            });
    }
    
    tokenInfo(){
            console.log("Invoking Token Info API");
            this.loading = true;
            this.authenticationService.getTokenInfo().subscribe(data=>{
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

    ngOnInit() {
        
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
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