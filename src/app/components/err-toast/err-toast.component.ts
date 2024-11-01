import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-err-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './err-toast.component.html',
  styleUrl: './err-toast.component.scss'
})
export class ErrToastComponent {
  @Input() msg: string = '';
  @Input() is_err: boolean = true;
  @Input() hidden: boolean = true;

  showErrToast = () => {
    this.hidden = false;
  }

  hideErrToast() {
    this.hidden = true;
  }
}
