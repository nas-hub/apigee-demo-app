import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { FormBuilder,FormControl, FormGroupDirective, FormGroup, NgForm, Validators } from '@angular/forms';
import { AlertService, AuthenticationService ,ConfigService} from '@app/_services';
import {DemoUsecase,Lookup, DemoUsecaseFactory,DemoConfigHolder} from '@app/_models';

@Component({templateUrl: 'apigee.login.component.html',styleUrls: ['apigee.login.component.css']})
export class ApigeeLoginComponent implements OnInit {
    loading = false;
    submitted = false;
    loginForm: FormGroup;
    returnUrl: string;
    state: string;
    userId:string;

    password:string;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService
    ) {
        
    }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.state = this.route.snapshot.queryParams['state'] || '/';

        this.loginForm = this.formBuilder.group({
            userId: [this.userId, Validators.required],
            password: [this.password, Validators.required]
        });
    }


    apigeeLogin() {
        this.userId = this.loginForm.value['userId'];
        this.password = this.loginForm.value['password'];

        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        let httpOptions = {
            headers:headers
        }
        let loginData = {
            userId:this.userId,
            password:this.password,
            state:this.state
        };
        
        let formData = 'state='+this.state+'&userId='+this.userId+'&password='+this.password;
        
        window.open('https://amer-demo14-test.apigee.net/v1/oidc/cicp/login?'+formData, '_self');  
        //TODO Fix the redirect issue; change GET to POST
       /*return this.http.post('https://amer-demo14-test.apigee.net/v1/oidc/cicp/login',loginData,httpOptions).subscribe(response =>{
           console.log(response);
       });*/
        
    }

}