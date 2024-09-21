import { Component } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { PasswordInputComponent } from "../password-input/password-input.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-p',
  standalone: true,
  imports: [LoginBtnComponent, EmailInputComponent, RouterLink],
  templateUrl: './reset-p.component.html',
  styleUrl: './reset-p.component.scss'
})
export class ResetPComponent {
  err_msg_active: boolean = false;
  email: string = '';

  onEmailChange(value: string) {
    this.email = value;
  }

  switchErrorMessage() {
    this.err_msg_active ? this.err_msg_active = false : this.err_msg_active = true;
  }
}
