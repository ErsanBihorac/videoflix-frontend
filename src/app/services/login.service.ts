import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response.model';
import { EmailRegisteredResponse } from '../interfaces/email-registered-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient);
  email: string = '';

  /**
   * Function to log in
   * @param email -Email value
   * @param password -Password value
   * @returns -Response
   */
  public loginWithEmailAndPassword(email: string, password: string) {
    const url = environment.baseUrl + '/api/login/';
    const headers = this.returnHeaders();
    const body = {
      "email": email,
      "password": password
    }

    return lastValueFrom(this.http.post<LoginResponse>(url, body, { headers: headers }));
  }

  /**
   * Function to register a new account
   * @param email -Email value
   * @param password -Password value
   * @returns -Response
   */
  public registerWithEmailAndPassword(email: string, password: string) {
    const url = environment.baseUrl + '/api/register/';
    const headers = this.returnHeaders();
    const body = {
      "email": email,
      "password": password
    }

    return lastValueFrom(this.http.post(url, body, { headers: headers }));
  }

  /**
   * Function to reset the password of an account
   * @param password -Password value
   * @param uidb64 -User Id in base64 code
   * @param token -User token
   * @returns -Response
   */
  public resetPassword(password: string, uidb64: string | null, token: string | null,) {
    if (uidb64 === null || token === null) {
      uidb64 = '';
      token = '';
    }

    const url = environment.baseUrl + '/api/password-reset-complete/';
    const headers = this.returnHeaders();
    const body = {
      "password": password,
      "token": token,
      "uidb64": uidb64
    }

    return lastValueFrom(this.http.patch(url, body, { headers: headers }));
  }

  /**
   * Function to request a reset password to the email
   * @param email -Email where the request will be sent to
   * @returns -Response
   */
  public requestResetEmail(email: string) {
    const url = environment.baseUrl + '/api/request-reset-email/';
    const headers = this.returnHeaders();
    const body = {
      "email": email,
    }

    return lastValueFrom(this.http.post(url, body, { headers: headers }));
  }

  /**
   * Function to check if an email address is registered
   * @param email -Email that will be checked
   * @returns -Response
   */
  public isEmailRegistered(email: string) {
    const url = environment.baseUrl + '/api/check-registered-email/';
    const headers = this.returnHeaders();
    const body = {
      "email": email,
    }

    return lastValueFrom(this.http.post<EmailRegisteredResponse>(url, body, { headers: headers }));
  }

  /**
   * Function to return headers
   * @returns -Headers
   */
  returnHeaders() {
    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return headers
  }

  /**
   * Function to receive a specific cookie
   * @param name -Key name of the cookie
   * @returns -Value of the cookie
   */
  private getCookie(name: string): string {
    let cookieValue = '';
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}
