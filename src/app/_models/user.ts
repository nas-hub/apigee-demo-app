import { TestBed } from "@angular/core/testing";

export class Lookup{
    
    static getConfigItem(itemId:string,demoConfigHolder:DemoConfigHolder):DemoConfigItem{
        for(let i = 0 ; i < demoConfigHolder.configItems.length;i++){
            if(demoConfigHolder.configItems[i].key == itemId){
                return demoConfigHolder.configItems[i];
            }
        }
        return null;
    }

    static  byId(itemId:string,demoConfigHolder:DemoConfigHolder):string{
        let item:DemoConfigItem = Lookup.getConfigItem(itemId,demoConfigHolder);
        if(item){
            return item.value;
        }
        return '__NO_SUCH_VALUE__FOR_KEY_'+itemId;
    }
}

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
}
export class BaseDemoConfig{
    clientId:string ="";
    orgName:string = "";
    envName:string = "";
    hostName:string ="";
    protectedApiURI:string = "";
    tokenURI:string = "";
    tokenInfoURI:string = "";
    idpLogoutEndpoint:string ="";
    noAccessApiURI:string="";
    tokenInfoCaption:string ="Get Token Info";
    protectedApiCaption:string = "Invoke Protected API";
    noAccessApiCaption:string = "No Access API";
    idpLogoutCaption:string ="Logout of IdP";
}

export class DemoUsecase{
    baseConfig:BaseDemoConfig = new BaseDemoConfig();
    constructor(public usecaseId:string,public usecaseName:string){

    }
}
export class DemoConfigItem{
    
    constructor(public key:string,
        public type:string = "string",
        public value:string,
        public advanced:boolean,
        public required:boolean,
        public caption:string,
        public info:string){

        }
        
}
export class DemoConfigHolder{

    configItems:DemoConfigItem[];
    /*demoItem:DemoConfigItem = new DemoConfigItem("clientId","string",true,"TBD")
    configItems:DemoConfigItem[] ={
        new DemoConfigItem("clientId","string",true,"TBD"),
        new DemoConfigItem("orgName","string",true,"TBD")
    }*/

    id:string;
    usecaseId:string;
    usecaseName:string;
    usecaseCaption:string;
    constructor(){
        
    }

    


}




export class DemoUsecaseFactory{

static usecases ={Pattern_1A_OIDC:
        {
                  id:"Pattern_1A_OIDC",
                  usecaseId:"Pattern_1A_OIDC",
                  usecaseName:"IdP based End-User Authentication : OIDC",
                  usecaseCaption:"IdP based End-User Authentication : OIDC",
                  configItems:[
                      {
                          key:"clientId",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"Apigee Client Id refers to the IdP Client Id",
                          caption:"Client Id"
                      },
                      {
                          key:"hostName",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"Apigee Hostname refers to the Apigee Virtual Host",
                          caption:"Hostname"
                      },
                      {
                          key:"tokenURI",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"The URI for requesting Tokens from Apigee",
                          caption:"Token URI"
                      },
                      {
                          key:"tokenInfoURI",
                          value:"",
                          required:false,
                          type:"string",
                          advanced:true,
                          info:"The URI for requesting Token Info from Apigee.",
                          caption:"Token Info URI"
                      },
                      {
                        key:"protectedApiURI",
                        value:"",
                        required:false,
                        type:"string",
                        advanced:true,
                        info:"The URI of a protected API on Apigee that is allowed access for this client.",
                        caption:"Protected API URI for the above ClientId"
                    },
                    {
                        key:"noAccessApiURI",
                        value:"",
                        required:false,
                        type:"string",
                        advanced:true,
                        info:"The URI of a protected API on Apigee that is NOT allowed access for this client.",
                        caption:"Protected API URI with NO access to this ClientId"
                    }
                    
                      
                  ]
      },
      Pattern_1A_SAML:
      {
                  id:"Pattern_1A_SAML",
                  usecaseId:"Pattern_1A_SAML",
                  usecaseName:"IdP based End-User Authentication : SAML",
                  usecaseCaption:"IdP based End-User Authentication : SAML",
                  configItems:[
                      {
                          key:"clientId",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"Apigee Client Id refers to the IdP Client Id",
                          caption:"Client Id"
                      },
                      {
                          key:"hostName",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"Apigee Hostname refers to the Apigee Virtual Host",
                          caption:"Hostname"
                      },
                      {
                          key:"tokenURI",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"The URL for providing requesting Tokens",
                          caption:"Token URI"
                      },
                      {
                          key:"tokenInfoURI",
                          value:"",
                          required:false,
                          type:"string",
                          advanced:true,
                          info:"The URI for requesting Token Info from Apigee.",
                          caption:"Token Info URI"
                      },
                      {
                          key:"protectedApiURI",
                          value:"",
                          required:false,
                          type:"string",
                          advanced:true,
                          info:"The URI of a protected API on Apigee that is allowed access for this client.",
                          caption:"Protected API URI for the above ClientId"
                      },
                      {
                          key:"noAccessApiURI",
                          value:"",
                          required:false,
                          type:"string",
                          advanced:true,
                          info:"The URI of a protected API on Apigee that is NOT allowed access for this client.",
                          caption:"Protected API URI with NO access to this ClientId"
                      },
                      {
                          key:"sloEndPoint",
                          value:"",
                          required:false,
                          type:"string",
                          advanced:true,
                          info:"Single Logout URL for invoking a logout from IdP",
                          caption:"Single Logout URL"
                      }
                  ]
      },
      Pattern_3A_OIDC:
      {
                  id:"Pattern_3A_OIDC",
                  usecaseId:"Pattern_3A_OIDC",
                  usecaseName:"Multi IdP based End-User Authentication : Any",
                  usecaseCaption:"Multi IdP based End-User Authentication : Any",
                  configItems:[
                      {
                          key:"clientId",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"Apigee Client Id refers to the IdP Client Id",
                          caption:"Client Id"
                      },
                      {
                          key:"hostName",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"Apigee Hostname refers to the Apigee Virtual Host",
                          caption:"Hostname"
                      },
                      {
                          key:"noAccessApiURI",
                          value:"",
                          required:false,
                          type:"string",
                          advanced:true,
                          info:"An API that is not allowed for this user.",
                          caption:"No Access API"
                      },
                      
                      {
                          key:"tokenURI",
                          value:"",
                          required:true,
                          type:"string",
                          advanced:false,
                          info:"The URL for providing requesting Tokens",
                          caption:"Token URI"
                      }
                  ]
      }
    };


    static pattern_1A_OIDC:string ="Pattern_1A_OIDC";
    static pattern_1B_OIDC:string ="Pattern_1B_OIDC";
    static pattern_3A_OIDC:string ="Pattern_3A_OIDC";
    static pattern_1A_SAML:string ="Pattern_1A_SAML";
    static pattern_1A_3LEG:string ="Pattern_1A_3LEG";
    static pattern_1A_OIDC_Name:string ="Pattern_1A_OIDC";
    static pattern_1B_OIDC_NAME:string ="Pattern_1B_OIDC";
    static pattern_3A_OIDC_NAME:string ="Pattern_3A_OIDC";
    static pattern_1A_SAML_NAME:string ="Pattern_1A_SAML";
    static pattern_1A_3LEG_NAME:string ="Pattern_1A_3LEG";
    static pattern_4A_CC:string ="Pattern_4A_CC";

    static usecaseIds = [DemoUsecaseFactory.pattern_1A_OIDC,DemoUsecaseFactory.pattern_1B_OIDC,DemoUsecaseFactory.pattern_3A_OIDC,DemoUsecaseFactory.pattern_1A_SAML,DemoUsecaseFactory.pattern_1A_3LEG];

    static getAllDemoUsecases():DemoUsecase[]{
        let demoUsecases = JSON.stringify(DemoUsecaseFactory.usecases);
        let demos:Map<string,DemoConfigHolder> = JSON.parse(demoUsecases);
        let usecaseList:DemoUsecase[] = [];

        this.usecaseIds.forEach(usecase=>{
            usecaseList.push(this.getDemoUsecase(usecase));
        });

        return usecaseList;
    }
    
    

    static getDemoUsecase(usecaseId:string){
        switch(usecaseId){



            case "Pattern_1A_OIDC":{
                let oidcDemoUsecase:DemoUsecase = new DemoUsecase(usecaseId,"IdP based End-User Authentication : OIDC");
                oidcDemoUsecase.baseConfig.protectedApiURI ="/v1/1a/oidc/idp/service1";
                oidcDemoUsecase.baseConfig.noAccessApiURI ="/v1/1a/oidc/idp/service2";
                oidcDemoUsecase.baseConfig.tokenInfoURI ="/v1/1a/oidc/idp/tokeninfo";
                oidcDemoUsecase.baseConfig.tokenURI ="/v1/1a/oidc/idp/authorize";
                return oidcDemoUsecase;
            }
            case "Pattern_1B_OIDC":{
                let oidcDemoUsecase:DemoUsecase = new DemoUsecase(usecaseId,"IdP based End-User Authentication : OIDC with IdP Access Token");
                oidcDemoUsecase.baseConfig.protectedApiURI ="/v1/1b/oidc/idp/service1";
                oidcDemoUsecase.baseConfig.noAccessApiURI ="/v1/1b/oidc/idp/service2";
                oidcDemoUsecase.baseConfig.tokenInfoURI ="/v1/1b/oidc/idp/tokeninfo";
                oidcDemoUsecase.baseConfig.tokenURI ="/v1/1b/oidc/idp/authorize";
                return oidcDemoUsecase;
            }

            case "Pattern_1A_SAML":{
                let oidcDemoUsecase:DemoUsecase = new DemoUsecase(usecaseId,"IdP based End-User Authentication : SAML");
                oidcDemoUsecase.baseConfig.protectedApiURI ="/v1/1a/saml/idp/service1";
                oidcDemoUsecase.baseConfig.noAccessApiURI ="/v1/1a/saml/idp/service2";
                oidcDemoUsecase.baseConfig.tokenInfoURI ="/v1/1a/saml/idp/tokeninfo";
                oidcDemoUsecase.baseConfig.tokenURI ="/v1/1a/saml/idp/authorize";
                return oidcDemoUsecase;
            }

            case "Pattern_1A_3LEG":{
                let oidcDemoUsecase:DemoUsecase = new DemoUsecase(usecaseId,"IdP based End-User Authentication : 3 Legged OAuth");
                oidcDemoUsecase.baseConfig.protectedApiURI ="/v1/1a/3loauth/idp/service1";
                oidcDemoUsecase.baseConfig.noAccessApiURI ="/v1/1a/3loauth/idp/service2";
                oidcDemoUsecase.baseConfig.tokenInfoURI ="/v1/1a/3loauth/idp/tokeninfo";
                oidcDemoUsecase.baseConfig.tokenURI ="/v1/1a/saml/3loauth/authorize";
                return oidcDemoUsecase;
            }

            case "Pattern_3A_OIDC":{
                let oidcDemoUsecase:DemoUsecase = new DemoUsecase(usecaseId,"Multi IdP based End-User Authentication : Any");
                oidcDemoUsecase.baseConfig.protectedApiURI ="/v1/3a/oidc/idp/service1";
                oidcDemoUsecase.baseConfig.noAccessApiURI ="/v1/3a/oidc/idp/service2";
                oidcDemoUsecase.baseConfig.tokenInfoURI ="/v1/3a/oidc/idp/tokeninfo";
                oidcDemoUsecase.baseConfig.tokenURI ="/v1/3a/oidc/idp/authorize";
                return oidcDemoUsecase;
            }
            
            
            
        }
    }


     

}