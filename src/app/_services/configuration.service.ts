import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseDemoConfig,DemoUsecase,DemoUsecaseFactory,DemoConfigHolder } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class ConfigService {


    private currentConfigSubject: BehaviorSubject<Map<string,DemoUsecase>>;
    public currentDemoConfigHoldersSubject: BehaviorSubject<Map<string,DemoConfigHolder>>;


    public selectedDemoConfig:DemoConfigHolder;
    public selectedDemoConfigSubject:BehaviorSubject<DemoConfigHolder>;

    private demoUsecases: DemoUsecase[] = DemoUsecaseFactory.getAllDemoUsecases();

    constructor(private http: HttpClient) {
        console.log("Invoked ConfigService...");


        this.currentDemoConfigHoldersSubject = new BehaviorSubject<Map<string,DemoConfigHolder>>(null);
        this.selectedDemoConfigSubject = new BehaviorSubject<DemoConfigHolder>(null);
        this.init(JSON.parse(JSON.stringify(DemoUsecaseFactory.usecases)),false,null);
    }

    private init(configData:Map<string,DemoConfigHolder>,forceRefresh:boolean,selectedId:string){
        
        if(forceRefresh){
            localStorage.setItem('demoConfigs',JSON.stringify(configData));
        }else if(!localStorage.getItem('demoConfigs')){
            localStorage.setItem('demoConfigs',JSON.stringify(configData));
        }else{
            configData = JSON.parse(localStorage.getItem('demoConfigs'));
        }
        this.currentDemoConfigHoldersSubject.next(configData);

        if(selectedId){
            if(configData[selectedId]){
                localStorage.setItem('selectedConfigId',selectedId);
            }
        }else{
            selectedId = localStorage.getItem('selectedConfigId');
            if(!selectedId){
                selectedId = Object.keys(configData)[0];
            }
            if(!configData[selectedId]){
                selectedId = Object.keys(configData)[0];
            }
                
        }

        this.selectedDemoConfig = configData[selectedId];
        this.selectedDemoConfigSubject.next(this.selectedDemoConfig);


        console.log("Currently selected "+this.selectedDemoConfig);

    }

    
    getDemoUsecases():DemoUsecase[]{
        return this.demoUsecases;
    }

    exportConfig():string{
        return localStorage.getItem('demoConfigs');
    }

    importConfig(data:string){
        let demoList:Map<string,DemoConfigHolder> = JSON.parse(data);
        if(!demoList) return false;
        if(!Object.keys(demoList)) return false;
        if(Object.keys(demoList).length < 1) return false;
        let demoKeys = Object.keys(demoList);
        for(let i:number = 0; i< demoKeys.length ;i++){
            let element = demoList[demoKeys[i]];
            if(!element) return false;
            if(!this.checkNotNullAndHasValue(element.id)) return false;
            if(!this.checkNotNullAndHasValue(element.usecaseId)) return false;
            if(!this.checkNotNull(element.usecaseCaption)) return false;
            if(!this.checkNotNullAndHasValue(element.usecaseName)) return false;
            for(let j:number = 0; j< element.configItems.length ;j++){
                let configItem = element.configItems[j];
                if(!configItem) return false;
                if(!this.checkNotNullAndHasValue(configItem.caption)) return false;
                if(!this.checkNotNullAndHasValue(configItem.info)) return false;
                if(!this.checkNotNullAndHasValue(configItem.key)) return false;
                //if(!this.checkNotNull(configItem.value)) return false;
                if(!this.checkNotNullAndHasValue(configItem.type)) return false;
            }
        }
        this.init(demoList,true,null);
        return true;
    }

    resetConfig(){
        console.log("Reseting the config to default config");
        this.init(JSON.parse(JSON.stringify(DemoUsecaseFactory.usecases)),true,null);
    }

    private checkNotNull(value:string):boolean{
        if(!value) return false;
        return true;
    }
    private checkNotNullAndHasValue(value:string):boolean{
        if(!value) return false;
        if(value.length<1) return false;
        return true;
    }
    public getConfig(): Map<string,DemoUsecase> {
        return this.currentConfigSubject.value;
    }

    public getCurrentSelectedUsecaseConfig():DemoUsecase{
        return this.currentConfigSubject.value['SELECTED'];
    }

    public getCurrentSelectedDemoConfig():DemoConfigHolder{
        return this.selectedDemoConfig;
    }

    public getUsecaseConfig(usecaseId:string): DemoUsecase {
        if(this.currentConfigSubject.value){
            return this.currentConfigSubject.value[usecaseId];
        }
    }

    updateUsecaseDemoConfig(id:string,demoConfigHolder:DemoConfigHolder){
        let currentDemoConfigs:Map<string,DemoConfigHolder> = JSON.parse(localStorage.getItem('demoConfigs'));
        currentDemoConfigs[demoConfigHolder.id] = demoConfigHolder;
        this.init(currentDemoConfigs,true,demoConfigHolder.id);
        
    }

    cloneUsecaseDemoConfig(demoConfigHolder:DemoConfigHolder){
        let newId = new Date().getTime()+"_";
        let currentDemoConfigs:Map<string,DemoConfigHolder> = JSON.parse(localStorage.getItem('demoConfigs'));
        let newDemoConfigHolder:DemoConfigHolder = JSON.parse(JSON.stringify(demoConfigHolder));
        newDemoConfigHolder.id = newId;
        newDemoConfigHolder.usecaseName = "Copy Of "+ demoConfigHolder.usecaseName;
        currentDemoConfigs[newDemoConfigHolder.id] = newDemoConfigHolder;
        this.init(currentDemoConfigs,true,newDemoConfigHolder.id);
    }


    
    deleteConfig() {
        // remove BaseDemoConfig from local storage
        localStorage.removeItem('currentConfig');
        this.currentConfigSubject.next(null);
    }
}