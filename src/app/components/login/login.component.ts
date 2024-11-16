import { Component, inject } from '@angular/core';
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, EmailInputComponent, PasswordInputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  ls = inject(LoginService);
  err_msg_active: boolean = false;
  err_msg: string = '';
  email: string = '';
  password: string = '';
  password_type: string = 'password';
  password_visibility: string = 'img/visibility.svg';

  constructor(private router: Router) { }

  /**
   * Function to log in
   */
  async login() {
    await this.ls.loginWithEmailAndPassword(this.email, this.password)
      .then(resp => {
        localStorage.setItem('authToken', resp.access)
        this.router.navigate(['/']);
      })
      .catch(e => {
        if (e.error.detail) {
          this.activateAndSetErrMsg('Please check your entries and try again.');
        }
      });
  }

  /**
   * Function to submit the form
   */
  submit() {
    if (this.emailValidation() && this.passwordValidation()) {
      this.login();
    }
  }

  /**
   * Function to validate the password field
   * @returns -Boolean value, true means the validation was successfull
   */
  passwordValidation() {
    if (this.password === '') {
      this.activateAndSetErrMsg('Please enter a password.');
      return false
    } else if (this.password.length < 6) {
      this.activateAndSetErrMsg('Your password must contain atleast 6 characters.');
      return false
    } else {
      this.deactivateErrMsg();
      return true
    }
  }

  /**
   * Function to validate the email field
   * @returns -Boolean value, true means the validation was successfull
   */
  emailValidation() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.email === '') {
      this.activateAndSetErrMsg('Please enter your email address.');
      return false
    } else if (emailPattern.test(this.email) === false) {
      this.activateAndSetErrMsg('Please enter a valid email address.');
      return false
    } else {
      this.deactivateErrMsg();
      return true
    }
  }

  /**
   * Function to display and set the error message
   * @param msg -String value which will be the error message
   */
  activateAndSetErrMsg(msg: string) {
    this.err_msg_active = true;
    this.err_msg = msg;
  }

  /**
   * Function to hide the error message
   */
  deactivateErrMsg() {
    this.err_msg_active = false;
  }

  /**
   * Function that executes everytime the email field value changes
   * @param value -String value of the email
   */
  onEmailChange(value: string) {
    this.email = value;
  }

  /**
   * Function that executes everytime the password field value changes
   * @param value -String value of the password
   */
  onPasswordChange(value: string) {
    this.password = value;
  }

  /**
   * Function to display or hide the password value
   */
  switchPasswordVisibility() {
    if (this.password_type === 'password') {
      this.password_type = 'text';
      this.password_visibility = 'img/visibility_off.svg';
    } else {
      this.password_type = 'password';
      this.password_visibility = 'img/visibility.svg';
    }
  }
}
