import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule,MatSelectModule,MatFormFieldModule, MatCheckboxModule,MatInputModule,MatListModule,MatGridListModule,MatCardModule} from '@angular/material';
import { NgxGistModule } from 'ngx-gist/dist/ngx-gist.module';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { ApigeeLoginComponent } from './apigeeLogin';
import { RegisterComponent } from './register';
import { DocsComponent } from './docs';
import { ConfigComponent } from './config';
import { CMComponent } from './cloudMigration';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatListModule,
        MatFormFieldModule,
        MatSelectModule,
        MatGridListModule,
        HttpClientModule,
        MatCardModule,
        NgxGistModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        DocsComponent,
        LoginComponent,
        ApigeeLoginComponent,
        ConfigComponent,
        CMComponent,
        RegisterComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }