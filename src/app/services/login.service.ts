import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface EmailRegisteredResponse {
  is_registered: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient);
  email: string = '';

  public loginWithEmailAndPassword(email: string, password: string) {
    const url = environment.baseUrl + '/api/login/';
    const body = {
      "email": email,
      "password": password
    }

    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return lastValueFrom(this.http.post(url, body, { headers: headers }));
  }

  public registerWithEmailAndPassword(email: string, password: string) {
    const url = environment.baseUrl + '/api/register/';
    const body = {
      "email": email,
      "password": password
    }

    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return lastValueFrom(this.http.post(url, body, { headers: headers }));
  }

  public resetPassword(password: string, uidb64: string | null, token: string | null,) {
    if (uidb64 === null || token === null) {
      uidb64 = '';
      token = '';
    }

    const url = environment.baseUrl + '/api/password-reset-complete/';
    const body = {
      "password": password,
      "token": token,
      "uidb64": uidb64
    }

    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return lastValueFrom(this.http.patch(url, body, { headers: headers }));
  }

  public requestResetEmail(email:string) {
    const url = environment.baseUrl + '/api/request-reset-email/';
    const body = {
      "email": email,
    }

    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return lastValueFrom(this.http.post(url, body, { headers: headers }));
  }

  public isEmailRegistered(email:string) {
    const url = environment.baseUrl + '/api/check-registered-email/';
    const body = {
      "email": email,
    }

    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return lastValueFrom(this.http.post<EmailRegisteredResponse>(url, body, { headers: headers }));
  }

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
