import { Component, inject } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { ErrToastComponent } from "../err-toast/err-toast.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, FormsModule, LoginBtnComponent, EmailInputComponent, PasswordInputComponent, RouterLink, ErrToastComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  ls = inject(LoginService);
  available: boolean = true;
  err_msg_active: boolean = false;
  err_msg: string = '';
  email: string = '';
  password: string = '';
  confirm_password: string = '';
  password_type: string = 'password';
  confirm_password_type: string = 'password';
  password_visibility: string = 'img/visibility.svg';
  confirm_password_visibility: string = 'img/visibility.svg';
  err_toast_msg: string = '';
  err_toast_is_error: boolean = true;
  err_toast_hidden: boolean = true;

  constructor( private router: Router) { }
  
  /**
   * Function to display, set the error toast message and if should appear as an error or normal popup
   * @param msg -Error toast message
   * @param is_err -Sets the error toast to an error if true
   */
  setAndShowErrToast(msg: string, is_err: boolean) {
    this.err_toast_msg = msg;
    this.err_toast_is_error = is_err;
    this.err_toast_hidden = false;
  }

  /**
   * Function to register
   */
  async register() {
    this.deactivateBtn();
      await this.ls.registerWithEmailAndPassword(this.email, this.password)
      .then(resp => {
        this.setAndShowErrToast('succesfully registered, please verify your account', false);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      })
      .catch(e => {
        if (e.error.email[0]) {
          this.activateAndSetErrMsg(e.error.email[0]);
        }
      });
  }

  /**
   * Function to submit the form
   */
  submit() {
    if (this.emailValidation() && this.passwordValidation() && this.confirmPasswordValidation()) {
      this.register();
    }
  }

  /**
   * Function to validate the confirm password field
   * @returns -True if validation is successfull
   */
  confirmPasswordValidation() {
    if (this.password !== this.confirm_password) {
      this.activateAndSetErrMsg('Passwords do not match.');
      return false
    } else {
      this.deactivateErrMsg();
      return true
    }
  }

  /**
   * Function to validate the password field
   * @returns -True if validation is successfull
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
   * @returns -True if validation is successfull
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
    };
  }

  /**
   * Function to display and set the error message
   * @param msg -Error message
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
   * Function that executes everytime the email field changes
   * @param value -Input value
   */
  onEmailChange(value: string) {
    this.email = value;
  }

  /**
   * Function that executes everytime the password field changes
   * @param value -Input value
   */
  onPasswordChange(value: string) {
    this.password = value;
  }

  /**
   * Function that executes everytime the confirm password field changes
   * @param value -Input value
   */
  onConfirmPasswordChange(value: string) {
    this.confirm_password = value;
  }

  /**
   * Function to hide or display the password value
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

  /**
   * Function to hide or display the confirm password value
   */
  switchConfirmPasswordVisibility() {
    if (this.confirm_password_type === 'password') {
      this.confirm_password_type = 'text';
      this.confirm_password_visibility = 'img/visibility_off.svg';
    } else {
      this.confirm_password_type = 'password';
      this.confirm_password_visibility = 'img/visibility.svg';
    }
  }

  /**
   * Function to enable the "get started" button
   */
  activateBtn() {
    this.available = true;
  }

  /**
   * Function to disable the "get started" button
   */
  deactivateBtn() {
    this.available = false;
  }
}
