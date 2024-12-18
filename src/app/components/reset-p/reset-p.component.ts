import { Component, inject, OnInit } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { ErrToastComponent } from "../err-toast/err-toast.component";

@Component({
  selector: 'app-reset-p',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginBtnComponent, PasswordInputComponent, RouterLink, ErrToastComponent],
  templateUrl: './reset-p.component.html',
  styleUrl: './reset-p.component.scss'
})
export class ResetPComponent implements OnInit {
  ls = inject(LoginService);
  available: boolean = false;
  err_msg_active: boolean = false;
  err_msg: string = '';
  password: string = '';
  confirm_password: string = '';
  password_type: string = 'password';
  confirm_password_type: string = 'password';
  password_visibility: string = 'img/visibility.svg';
  confirm_password_visibility: string = 'img/visibility.svg';
  uidb64: string | null = null;
  token: string | null = null;
  err_toast_msg: string = '';
  err_toast_is_error: boolean = true;
  err_toast_hidden: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.uidb64 = this.route.snapshot.paramMap.get('uidb64');
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.uidb64 == null || this.token == null) {
      this.uidb64 = '';
      this.token = '';
    }
  }

  setAndShowErrToast(msg: string, is_err: boolean) {
    this.err_toast_msg = msg;
    this.err_toast_is_error = is_err;
    this.err_toast_hidden = false;
  }

  /**
   * Function to reset the password
   */
  async reset_password() {
    await this.ls.resetPassword(this.password, this.uidb64, this.token)
      .then(resp => {
        this.setAndShowErrToast('password reset successfully', false);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      })
      .catch(e => {
        if (e.error.detail) {
          this.activateAndSetErrMsg(e.error.detail);
        }
      });
  }

  /**
   * Function to submit the form
   */
  submit() {
    if (this.passwordValidation() && this.confirmPasswordValidation()) {
      this.reset_password();
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
   * Function to enable and set the error message
   * @param msg -Error message
   */
  activateAndSetErrMsg(msg: string) {
    this.err_msg_active = true;
    this.err_msg = msg;
  }

  /**
   * Function to disable the error message
   */
  deactivateErrMsg() {
    this.err_msg_active = false;
  }

  /**
   * Function that executes everytime the password value changes
   * @param value -Input value
   */
  onPasswordChange(value: string) {
    this.password = value;
    this.checkPasswordSimilarity();
  }

  /**
   * Function that executes everytime the confirm password value changes
   * @param value -Input value
   */
  onConfirmPasswordChange(value: string) {
    this.confirm_password = value;
    this.checkPasswordSimilarity();
  }

  /**
   * Function to check if the password and confirm password values are the same
   */
  checkPasswordSimilarity() {
    if (this.password === this.confirm_password) {
      this.available = true;
    } else {
      this.available = false;
    }
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

  /**
   * Function to display or hide the confirm password value
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
}
