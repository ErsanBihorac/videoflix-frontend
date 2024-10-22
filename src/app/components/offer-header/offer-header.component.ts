import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-offer-header',
  standalone: true,
  imports: [],
  templateUrl: './offer-header.component.html',
  styleUrl: './offer-header.component.scss'
})
export class OfferHeaderComponent {
  constructor(private router: Router) { }

   logout(){
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
   }
}
