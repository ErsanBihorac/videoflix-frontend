import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './email-input.component.html',
  styleUrl: './email-input.component.scss'
})
export class EmailInputComponent {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Output() inputChange = new EventEmitter<string>();
  value: string = '';

  onInputChange(value: string) {
    this.value = value;
    this.inputChange.emit(this.value);
  }
}
