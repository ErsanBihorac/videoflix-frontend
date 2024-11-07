import { Component, inject } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ErrToastComponent } from "../err-toast/err-toast.component";

@Component({
  selector: 'app-forgot-p',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginBtnComponent, EmailInputComponent, RouterLink, ErrToastComponent],
  templateUrl: './forgot-p.component.html',
  styleUrl: './forgot-p.component.scss'
})
export class ForgotPComponent {
  ls = inject(LoginService);
  available: boolean = false;
  email: string = '';
  err_msg_active: boolean = false;
  err_msg: string = 'false';
  err_toast_msg: string = '';
  err_toast_is_error: boolean = true;
  err_toast_hidden: boolean = true;

  /**
   * Function to set the error message, the error toast can be displayed as an error or as a normal popup
   * @param msg - String message
   * @param is_err - Boolean that sets it to an error (true) or popup (false)
   */
  setAndShowErrToast(msg: string, is_err: boolean) {
    this.err_toast_msg = msg;
    this.err_toast_is_error = is_err;
    this.err_toast_hidden = false;
  }

  /**
   * Function to request the email to reset the password
   */
  async requestEmail() {
    this.deactivateBtn();

    await this.ls.requestResetEmail(this.email)
      .then(resp => {
        this.setAndShowErrToast('We have sent you an email to reset your password', false);
      })
      .catch(e => {
        this.activateAndSetErrMsg(e);
      });
  }

  /**
   * Function to submit the form
   */
  submit() {
    this.requestEmail();
  }

  /**
   * Function to Validate the email input field
   * @returns -Boolean value, true means the the validation was successfull
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
   * Function to check if the email address is already registered
   * @returns -Boolean value, true means the email address is registered
   */
  async isEmailRegistered() {
    return this.ls.isEmailRegistered(this.email)
      .then(resp => {
        return resp.is_registered;
      })
      .catch(e => {
        this.activateAndSetErrMsg(e);
        return false;
      });
  }

  /**
   * Function to activate and set the error message on the Form
   * @param msg -String value that will be displayed as the error
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
   * Function to enable the send email button
   */
  activateBtn() {
    this.available = true;
  }

  /**
   * Function to disable the send email button
   */
  deactivateBtn() {
    this.available = false;
  }

  /**
   * Function that gets executed everytime the email value changes
   * @param value 
   */
  async onEmailChange(value: string) {
    this.email = value;
    if (this.emailValidation()) {
        this.activateBtn();
    } else {
      this.deactivateBtn();
    }
  }
}
