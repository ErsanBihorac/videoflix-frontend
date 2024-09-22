import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component'
import { LoginComponent } from './components/login/login.component'
import { ImprintComponent } from './components/imprint/imprint.component'
import { RegisterComponent } from './components/register/register.component'
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component'
import { ResetPComponent } from './components/reset-p/reset-p.component';
import { ForgotPComponent } from './components/forgot-p/forgot-p.component';
import { VideoOfferComponent } from './components/video-offer/video-offer.component';
import { VideoplayerComponent } from './components/videoplayer/videoplayer.component';

export const routes: Routes = [
    { path: '', component: VideoOfferComponent },
    { path: 'videoplayer', component: VideoplayerComponent },
    { path: 'homepage', component: HomepageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'reset-password', component: ResetPComponent },
    { path: 'forgot-password', component: ForgotPComponent },
];
