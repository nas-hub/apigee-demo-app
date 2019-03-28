import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormControl, FormGroupDirective, FormGroup, NgForm, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, ConfigService, AuthenticationService } from '@app/_services';
import {ErrorStateMatcher} from '@angular/material/core';
import { BaseDemoConfig,DemoUsecase, DemoConfigHolder, DemoConfigItem } from '@app/_models';
import saveAs from 'file-saver';


@Component({templateUrl: 'config.component.html',styleUrls: ['config.component.css']})
export class ConfigComponent implements OnInit {
    registerForm: FormGroup;
    configForm: FormGroup;
    loading = false;
    submitted = false;
    demoUsecases:DemoUsecase[];
    demoConfigs:Map<string,DemoConfigHolder>;
    selectedDemoConfigId:string;
    selectedDemoConfig:DemoConfigHolder;
    selectedUsecase:string;
    showMore:boolean=false;
    toggleShowMoreCaption:string = "Show more";
    
    //demoConfigHolder:DemoConfigHolder;
    
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private configService: ConfigService,
        private userService: UserService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService
    ) { 
        this.demoUsecases = configService.getDemoUsecases();
        configService.currentDemoConfigHoldersSubject.subscribe(_demoConfigs =>{
                this.demoConfigs = _demoConfigs;
        });
    }

    ngOnInit__() {
        let demoUsecase:DemoUsecase = this.configService.getCurrentSelectedUsecaseConfig();
        this.selectedUsecase = demoUsecase.usecaseId;
        this.registerForm = this.formBuilder.group({
            clientId: [demoUsecase.baseConfig.clientId, Validators.required],
            hostName: [demoUsecase.baseConfig.hostName, Validators.required],
            tokenInfoURI: [demoUsecase.baseConfig.tokenInfoURI, Validators.required],
            tokenURI: [demoUsecase.baseConfig.tokenURI, Validators.required],
            noAccessApiURI: [demoUsecase.baseConfig.noAccessApiURI],
            idpLogoutEndpoint: [demoUsecase.baseConfig.idpLogoutEndpoint],
            protectedApiURI: [demoUsecase.baseConfig.protectedApiURI, [Validators.required]],
            idpLogoutCaption:  [demoUsecase.baseConfig.idpLogoutCaption],
            tokenInfoCaption: [demoUsecase.baseConfig.tokenInfoCaption],
            protectedApiCaption: [demoUsecase.baseConfig.protectedApiCaption],
            noAccessApiCaption: [demoUsecase.baseConfig.noAccessApiCaption]
        });
    }

    ngOnInit(){
        let formGroupData:any = {};
            this.configService.selectedDemoConfigSubject.subscribe(currentDemoConfig => {
            this.selectedDemoConfig = currentDemoConfig;
            this.selectedDemoConfigId = this.selectedDemoConfig.usecaseName;
            formGroupData['usecaseId'] = [this.selectedDemoConfig.usecaseId,Validators.required];
            formGroupData['usecaseName'] = [this.selectedDemoConfig.usecaseName,Validators.required];
            this.selectedDemoConfig.configItems.forEach(configItem =>{
                formGroupData[configItem.key] = [configItem.value,configItem.required?Validators.required:Validators.nullValidator]
            });
            this.configForm = this.formBuilder.group(formGroupData);
        });
    }

    toggleShowMore(){
        if(this.showMore){
            this.showMore = false;
            this.toggleShowMoreCaption = "Show More";
        }else{
            this.showMore = true;
            this.toggleShowMoreCaption = "Show Less";
        }
    }

    onUsecaseSelected(){
        let demoUsecase:DemoUsecase = this.demoUsecases.find(usecase => usecase.usecaseId == this.selectedUsecase);
        this.updateConfigView(this.configService.getUsecaseConfig(demoUsecase.usecaseId));
    }
    onDemoConfigSelected(){
        Object.keys(this.demoConfigs).forEach(key =>{
            let _demoConfig = this.demoConfigs[key];
            if(_demoConfig.usecaseName == this.selectedDemoConfigId){
                this.selectedDemoConfig = _demoConfig;
            }
        });
        let formGroupData:any = {};
        formGroupData['usecaseId'] = [this.selectedDemoConfig.usecaseId,Validators.required];
            formGroupData['usecaseName'] = [this.selectedDemoConfig.usecaseName,Validators.required];
            
        this.selectedDemoConfig.configItems.forEach(configItem =>{
            formGroupData[configItem.key] = [configItem.value,configItem.required?Validators.required:Validators.nullValidator]
        });
        this.configForm = this.formBuilder.group(formGroupData);

        console.log("Selected Demo Config is :"+ JSON.stringify(this.selectedDemoConfig));
        this.updateDemoConfigView(this.selectedDemoConfig);
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit__() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;
        let selectedDemoUsease:DemoUsecase = this.demoUsecases.find(usecase => usecase.usecaseId == this.selectedUsecase);
        let demoUsecase:DemoUsecase = new DemoUsecase(selectedDemoUsease.usecaseId,selectedDemoUsease.usecaseName);
        demoUsecase.baseConfig.clientId = this.registerForm.value.clientId;
        demoUsecase.baseConfig.hostName = this.registerForm.value.hostName;
        demoUsecase.baseConfig.tokenInfoURI = this.registerForm.value.tokenInfoURI;
        demoUsecase.baseConfig.tokenURI = this.registerForm.value.tokenURI;
        demoUsecase.baseConfig.protectedApiURI = this.registerForm.value.protectedApiURI;
        demoUsecase.baseConfig.noAccessApiURI  = this.registerForm.value.noAccessApiURI;
        demoUsecase.baseConfig.idpLogoutEndpoint = this.registerForm.value.idpLogoutEndpoint;
        demoUsecase.baseConfig.idpLogoutCaption = this.registerForm.value.idpLogoutCaption;
        demoUsecase.baseConfig.tokenInfoCaption = this.registerForm.value.tokenInfoCaption;
        demoUsecase.baseConfig.protectedApiCaption = this.registerForm.value.protectedApiCaption;
        demoUsecase.baseConfig.noAccessApiCaption = this.registerForm.value.noAccessApiCaption;
        
        //this.configService.updateConfig(demoUsecase.usecaseId,demoUsecase);
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        this.loading = false;
    
    }

    onConfigUpdated(){
        //let demoConfigHolder:DemoConfigHolder = this.selectedDemoConfig;
        this.selectedDemoConfig.usecaseName =  this.configForm.value['usecaseName'];
        this.selectedDemoConfig.configItems.forEach(configItem =>{
            configItem.value = this.configForm.value[configItem.key]
        });

        this.configService.updateUsecaseDemoConfig(this.selectedDemoConfig.id,this.selectedDemoConfig);
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        this.loading = false;

    }

    cloneConfig(){
        this.configService.cloneUsecaseDemoConfig(this.selectedDemoConfig);
    }

    clearConfig(){
        this.configService.resetConfig();
        let demoConfigHolder:DemoConfigHolder = this.configService.getCurrentSelectedDemoConfig();
        this.updateDemoConfigView(demoConfigHolder);
    }

    updateDemoConfigView(demoConfigHolder:DemoConfigHolder){
        demoConfigHolder.configItems.forEach(configItem =>{
            configItem.value = this.configForm.value[configItem.key]
        });
    }

    initImportConfig(){
        document.getElementById("fileInput").click();
    }
    exportConfig(){
        saveAs(new Blob([this.configService.exportConfig()],{type:'application/json'}), "ApigeeDemoConfig.json")
    }
    onFileSelected(files:File[]){
        let reader = new FileReader();
 
        if (files.length > 0) {
            let file:File = files[0];
            reader.readAsText(file);
            reader.onload = () => {
                //let newConfigData = JSON.parse(reader.result.toString());
                if(!this.configService.importConfig(reader.result.toString())){
                    this.alertService.error("File being imported is corrupted :-(");
                }else{
                    this.alertService.success("Updated configuration.");
                }
            }
        }
        
          /*
        if(event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
        
          reader.onload = () => {
            console.log(reader.result);
            }
        }*/
      
    }
    updateConfigView(demoUsecase:DemoUsecase){
        this.registerForm.patchValue({
            clientId: demoUsecase.baseConfig.clientId,
            hostName: demoUsecase.baseConfig.hostName,
            tokenURI: demoUsecase.baseConfig.tokenURI,
            tokenInfoURI: demoUsecase.baseConfig.tokenInfoURI,
            protectedApiURI: demoUsecase.baseConfig.protectedApiURI,
            noAccessApiURI: demoUsecase.baseConfig.noAccessApiURI,
            idpLogoutEndpoint: demoUsecase.baseConfig.idpLogoutEndpoint,
            idpLogoutCaption:  demoUsecase.baseConfig.idpLogoutCaption,
            tokenInfoCaption: demoUsecase.baseConfig.tokenInfoCaption,
            protectedApiCaption: demoUsecase.baseConfig.protectedApiCaption,
            noAccessApiCaption: demoUsecase.baseConfig.noAccessApiCaption
        });
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }