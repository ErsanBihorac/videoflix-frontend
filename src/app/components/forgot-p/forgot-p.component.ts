import { Component, inject } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-forgot-p',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginBtnComponent, EmailInputComponent, RouterLink],
  templateUrl: './forgot-p.component.html',
  styleUrl: './forgot-p.component.scss'
})
export class ForgotPComponent {
  ls = inject(LoginService);
  available: boolean = false;
  err_msg_active: boolean = false;
  err_msg: string = 'false';

  email: string = '';

  async requestEmail() {
    await this.ls.requestResetEmail(this.email)
      .then(resp => {
        console.log('email sent sucessfully', resp);
        // user success message toast
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

  async onEmailChange(value: string) {
    this.email = value;
    if (this.emailValidation()) {
      if (await this.isEmailRegistered()) {
        this.available = true;
      }
    } else {
      this.available = false
    }
  }
}
