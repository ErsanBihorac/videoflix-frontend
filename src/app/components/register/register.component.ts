import { Component } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [LoginBtnComponent, EmailInputComponent, PasswordInputComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  err_msg_active: boolean = false;
  email: string = '';
  password: string = '';
  confirm_password: string = '';

  password_type: string = 'password';
  confirm_password_type: string = 'password';

  password_visibility: string = 'img/visibility.svg';
  confirm_password_visibility: string = 'img/visibility.svg';

  onEmailChange(value: string) {
    this.email = value;
  }

  onPasswordChange(value: string) {
    this.password = value;
  }

  onConfirmPasswordChange(value: string) {
    this.confirm_password = value;
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

  switchConfirmPasswordVisibility() {
    if (this.confirm_password_type === 'password') {
      this.confirm_password_type = 'text';
      this.confirm_password_visibility = 'img/visibility_off.svg';
    } else {
      this.confirm_password_type = 'password';
      this.confirm_password_visibility = 'img/visibility.svg';
    }
  }

  switchErrorMessage() {
    this.err_msg_active ? this.err_msg_active = false : this.err_msg_active = true;
  }
}
