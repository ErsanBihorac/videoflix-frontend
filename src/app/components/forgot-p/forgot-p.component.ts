import { Component } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { EmailInputComponent } from "../email-input/email-input.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-p',
  standalone: true,
  imports: [CommonModule, LoginBtnComponent, EmailInputComponent, RouterLink],
  templateUrl: './forgot-p.component.html',
  styleUrl: './forgot-p.component.scss'
})
export class ForgotPComponent {
  available: boolean = false;
  err_msg_active: boolean = false;
  email: string = '';

  onEmailChange(value: string) {
    this.email = value;
  }

  switchErrorMessage() {
    this.err_msg_active ? this.err_msg_active = false : this.err_msg_active = true;
  }
}
