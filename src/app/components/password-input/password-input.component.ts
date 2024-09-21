import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss'
})
export class PasswordInputComponent {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Output() inputChange = new EventEmitter<string>();
  value: string = '';

  onInputChange(value: string) {
    this.value = value;
    this.inputChange.emit(this.value);
  }
}
