import { Component, inject } from '@angular/core';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [LoginBtnComponent, RouterLink, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  ls = inject(LoginService);
}
