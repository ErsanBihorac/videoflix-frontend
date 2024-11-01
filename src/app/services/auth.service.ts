import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  /**
   * Function to check if user is authenticated
   * @returns -Authentication Token
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Function to log out
   */
  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
