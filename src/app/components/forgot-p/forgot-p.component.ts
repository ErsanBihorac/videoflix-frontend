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

  setAndShowErrToast(msg: string, is_err: boolean) {
    this.err_toast_msg = msg;
    this.err_toast_is_error = is_err;

    this.err_toast_hidden = false;
  }

  async requestEmail() {
    this.deactivateBtn();

    await this.ls.requestResetEmail(this.email)
      .then(resp => {
        console.log('email sent sucessfully', resp);
        this.setAndShowErrToast('We have sent you an email to reset your password', false);
      })
      .catch(e => {
        if (e) {
          this.activateAndSetErrMsg(e);
          console.log('error', e);
        } else {
          console.log('error', e);
        }
      });
  }

  submit() {
    this.requestEmail();
  }

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

  async isEmailRegistered() {
    return this.ls.isEmailRegistered(this.email)
      .then(resp => {
        return resp.is_registered;
      })
      .catch(e => {
        this.activateAndSetErrMsg(e);
        console.log('error', e);
        return false;
      });
  }

  activateAndSetErrMsg(msg: string) {
    this.err_msg_active = true;
    this.err_msg = msg;
  }

  deactivateErrMsg() {
    this.err_msg_active = false;
  }

  activateBtn() {
    this.available = true;
  }

  deactivateBtn() {
    this.available = false;
  }

  async onEmailChange(value: string) {
    this.email = value;
    if (this.emailValidation()) {
      if (await this.isEmailRegistered()) {
        this.activateBtn()
      }
    } else {
      this.deactivateBtn()
    }
  }
}
