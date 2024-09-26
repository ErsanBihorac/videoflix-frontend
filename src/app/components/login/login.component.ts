import { Component, inject } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LoginBtnComponent, EmailInputComponent, PasswordInputComponent, RouterLink],
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

  async login() {
    await this.ls.loginWithEmailAndPassword(this.email, this.password)
      .then(resp => {
        console.log('Login erfolgreich', resp)
        // user success message before navigating
        this.router.navigate(['/']);
      })
      .catch(e => {
        if (e.error.detail) {
          this.activateAndSetErrMsg(e.error.detail);
          console.log('error', e);
        } else {
          console.log('error', e);
        }
      });

  }

  submit() {
    if (this.emailValidation() && this.passwordValidation()) {
      this.login();
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
