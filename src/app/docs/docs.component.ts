import { Component, OnInit, OnDestroy } from '@angular/core';

import { User,DemoUsecase, DemoConfigHolder } from '@app/_models';
import { UserService,ConfigService, AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'docs.component.html' })
export class DocsComponent implements OnInit, OnDestroy {

    demoConfigHolder:DemoConfigHolder;

    constructor(
        private configService:ConfigService
    ) {
        this.configService.selectedDemoConfigSubject.subscribe(demoConfigHolder =>{
            this.demoConfigHolder = demoConfigHolder;
            
            
        });
    }

    ngOnInit() { 
    }

    ngOnDestroy() {
        //TODO unsubscribe the BehaviorSubject
    }


}