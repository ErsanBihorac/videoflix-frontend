import { Component, inject, OnInit } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-p',
  standalone: true,
  imports: [ FormsModule,CommonModule, LoginBtnComponent, EmailInputComponent, PasswordInputComponent, RouterLink],
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

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.uidb64 = this.route.snapshot.paramMap.get('uidb64');
    this.token = this.route.snapshot.paramMap.get('token');

    if (this.uidb64 == null || this.token == null){
      this.uidb64 = '';
      this.token = ''
    }
  }

  async reset_password() {
      await this.ls.resetPassword(this.password, this.uidb64, this.token)
        .then(resp => {
          console.log('password reset successfully', resp);
          // user success message toast before navigating
          this.router.navigate(['/login']);
        })
        .catch(e => {
          if (e.error) {
            this.activateAndSetErrMsg(e.error);
            console.log('error', e);
          } else {
            console.log('error', e);
          }
        });
  }

  submit() {
    if (this.passwordValidation() && this.confirmPasswordValidation()) {
      this.reset_password();
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

  activateAndSetErrMsg(msg: string) {
    this.err_msg_active = true;
    this.err_msg = msg;
  }

  deactivateErrMsg() {
    this.err_msg_active = false;
  }

  onPasswordChange(value: string) {
    this.password = value;
    this.checkPasswordSimilarity();
  }

  onConfirmPasswordChange(value: string) {
    this.confirm_password = value;
    this.checkPasswordSimilarity();
  }

  checkPasswordSimilarity(){
    if (this.password === this.confirm_password){
      this.available = true
    } else {
      this.available = false
    }
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
