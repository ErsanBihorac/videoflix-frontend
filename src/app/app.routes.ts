import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component'
import { LoginComponent } from './components/login/login.component'
import { ImprintComponent } from './components/imprint/imprint.component'
import { RegisterComponent } from './components/register/register.component'
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component'

export const routes: Routes = [
    { path: 'homepage', component: HomepageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
