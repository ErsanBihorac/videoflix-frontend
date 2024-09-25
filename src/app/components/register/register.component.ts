import { Component, inject } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, LoginBtnComponent, EmailInputComponent, PasswordInputComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  ls = inject(LoginService);
  err_msg_active: boolean = false;
  err_msg: string = '';

  email: string = '';
  password: string = '';
  confirm_password: string = '';

  password_type: string = 'password';
  confirm_password_type: string = 'password';

  password_visibility: string = 'img/visibility.svg';
  confirm_password_visibility: string = 'img/visibility.svg';
  constructor( private router: Router) { }
  
  async register() {
      await this.ls.registerWithEmailAndPassword(this.email, this.password)
      .then(resp => {
        console.log('succesfully registered', resp);
        this.router.navigate(['/login']);
      })
      .catch(e => {
        if (e.error.email[0]) {
          this.activateAndSetErrMsg(e.error.email[0]);
          console.log('error', e);
        } else {
          console.log('error', e);
        }
      });;
  }

  submit() {
    if (this.emailValidation() && this.passwordValidation() && this.confirmPasswordValidation()) {
      this.register();
    }
  }

  confirmPasswordValidation() {
    if (this.password !== this.confirm_password) {
      this.activateAndSetErrMsg('Passwords do not match.');
      return false
    } else {
      this.deactivateErrMsg();
      return true
    }
  }

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

  activateAndSetErrMsg(msg: string) {
    this.err_msg_active = true;
    this.err_msg = msg;
  }

  deactivateErrMsg() {
    this.err_msg_active = false;
  }

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
