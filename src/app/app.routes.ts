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
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: VideoOfferComponent, canActivate: [AuthGuard] },
    { path: 'videoplayer', component: VideoplayerComponent, canActivate: [AuthGuard] },
    { path: 'homepage', component: HomepageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'reset-password/:uidb64/:token', component: ResetPComponent },
    { path: 'forgot-password', component: ForgotPComponent },
    { path: '**', component: PageNotFoundComponent },
];
