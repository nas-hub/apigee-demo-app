import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User,Lookup,DemoUsecase, DemoConfigHolder } from '@app/_models';
import {ConfigService} from './configuration.service'
import {AlertService} from './alert.service'


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    constructor(private http: HttpClient, private configService:ConfigService, private alertService:AlertService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    loginWithToken(token:string,name:string,email:string){
        console.log("Now saving the user with user name "+email);
        let loggedUser = new User();
        loggedUser.id = 10;
        loggedUser.firstName = name;
        loggedUser.lastName = email;
        loggedUser.username = email;
        loggedUser.token = token;
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        this.currentUserSubject.next(loggedUser);
    }

    getToken(){
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig(); 
        
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa(Lookup.byId("clientId", config)+":"+Lookup.byId("clientSecret", config)));
        headers = headers.append("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        let httpOptions = {
            headers:headers
        }
        /*let formData = new FormData();
        formData.append('cache-control', 'no-cache');
        formData.append('grant_type', 'client_credentials');
        The Form Data approach did not work*/
        let formData = 'grant_type=client_credentials&cache-control=no-cache';

       return this.http.post('https://'+Lookup.byId("hostName", config)+Lookup.byId("tokenURI", config),formData,httpOptions);
                    

    }
    protectedAPI(){    
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig();           
        return this.http.get<any>('https://'+Lookup.byId("hostName", config)+Lookup.byId("protectedApiURI", config)+'?access_token='+this.currentUserSubject.value.token);
    }

    invokeIstioAPIDirect(){    
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig();
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Bearer " + this.currentUserSubject.value.token);
        let httpOptions = {
            headers:headers
        }           
        return this.http.get<any>(Lookup.byId("istioAPIDirectURL",config),httpOptions);
    }

    invokeIstioViaEdge(){    
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig();
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Bearer " + this.currentUserSubject.value.token);
        let httpOptions = {
            headers:headers
        }           
        return this.http.get<any>(Lookup.byId("istioAPIViaEdgeURL",config),httpOptions);
    }

    noAccessAPI(){
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig();         
        return this.http.get<any>('https://'+Lookup.byId("hostName", config)+Lookup.byId("noAccessApiURI", config)+'?access_token='+this.currentUserSubject.value.token);
    }


    getTokenInfo(){ 
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig();               
        return this.http.get<any>('https://'+Lookup.byId("hostName", config)+Lookup.byId("tokenInfoURI", config)+'?access_token='+this.currentUserSubject.value.token);
    }

    getOIDCInfo(){ 
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig();               
        return this.http.get<any>(Lookup.byId("wellknownConfigEndpoint", config));
    }


    login() {
        let config:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig(); 
       return  this.http.get<any>('https://'+Lookup.byId("hostName", config)+Lookup.byId("tokenURI", config)+'?client_id='+Lookup.byId("clientId", config))
            .pipe(map(user => {
                console.log("Completed Token Call");
            }));
    }

    
    

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}

