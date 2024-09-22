import { Component } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [LoginBtnComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

}
