import { Component } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginBtnComponent, EmailInputComponent, PasswordInputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  err_msg_active: boolean = false;
  email: string = '';
  password: string = '';

  password_type: string = 'password';

  password_visibility: string = 'img/visibility.svg';

  onEmailChange(value: string) {
    this.email = value;
  }

  onPasswordChange(value: string) {
    this.password = value;
  }

  switchPasswordVisibility() {
    if (this.password_type === 'password') {
      this.password_type = 'text';
      this.password_visibility = 'img/visibility_off.svg';
    } else {
      this.password_type = 'password';
      this.password_visibility = 'img/visibility.svg';
    }
  }

  switchErrorMessage() {
    this.err_msg_active ? this.err_msg_active = false : this.err_msg_active = true;
  }
}
