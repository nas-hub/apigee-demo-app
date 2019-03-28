import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { DocsComponent } from './docs';
import { CMComponent } from './cloudMigration';
import { ConfigComponent } from './config';
import { AuthGuard } from './_guards';
import { ApigeeLoginComponent } from './apigeeLogin';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'cicpLogin', component: ApigeeLoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'config', component: ConfigComponent },
    { path: 'docs', component: DocsComponent },
    { path: 'cm', component: CMComponent },
    

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);