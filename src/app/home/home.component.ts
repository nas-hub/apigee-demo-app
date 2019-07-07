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
    hasInvokeIstioAPIDirect:boolean;
    invokeIstioAPIDirect:string;
    hasInvokeIstioViaEdge:boolean;
    invokeIstioViaEdge:string;
    welcomeMessage:string;

    resetActions(){
        this.introspectToken ="Introspect Token";
        this.hasIntrospectToken = false;
        this.hasInvokeProtectedApi = false;
        this.hasInvokeProtectedApiNoAccess = false;
        this.hasInvokeIstioAPIDirect = false;
        this.hasInvokeIstioViaEdge = false;
        this.invokeProtectedApi ="Invoke Protected API";
        this.invokeProtectedApiNoAccess ="Invoke No Access API";
        this.invokeIstioAPIDirect = "Invoke Istio Service Direct";
        this.invokeIstioViaEdge = "Invoke Istio Service Via Edge";
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

            let istioAPIDirectURIConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "istioAPIDirectURL");
            let istioAPIDirectCaptionConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "istioAPIDirectCaption");
            let istioAPIViaEdgeURIConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "istioAPIViaEdgeURL");
            let istioAPIViaEdgeCaptionConfigItem = this.selectedDemoUsecase.configItems.find(configItem => configItem.key == "istioAPIViaEdgeCaption");

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

            if(istioAPIDirectURIConfigItem && istioAPIDirectURIConfigItem.value && istioAPIDirectURIConfigItem.value.length>1){
                this.hasInvokeIstioAPIDirect = true;
                if(istioAPIDirectCaptionConfigItem && istioAPIDirectCaptionConfigItem.value && istioAPIDirectCaptionConfigItem.value.length>1){
                    this.invokeIstioAPIDirect = istioAPIDirectCaptionConfigItem.value;
                } 
            }

            if(istioAPIViaEdgeURIConfigItem && istioAPIViaEdgeURIConfigItem.value && istioAPIViaEdgeURIConfigItem.value.length>1){
                this.hasInvokeIstioViaEdge = true;
                if(istioAPIViaEdgeCaptionConfigItem && istioAPIViaEdgeCaptionConfigItem.value && istioAPIViaEdgeCaptionConfigItem.value.length>1){
                    this.invokeIstioViaEdge = istioAPIViaEdgeCaptionConfigItem.value;
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
    

    _invokeIstioAPIDirect(){
        console.log("Invoking Protected API");
        this.loading = true;
            this.authenticationService.invokeIstioAPIDirect().subscribe(data=>{
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
    
    _invokeIstioViaEdge(){
        console.log("Invoking Protected API");
        this.loading = true;
            this.authenticationService.invokeIstioViaEdge().subscribe(data=>{
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