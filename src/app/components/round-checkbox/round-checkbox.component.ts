import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-round-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './round-checkbox.component.html',
  styleUrl : './round-checkbox.component.scss',
})
export class RoundCheckboxComponent {
  @Input() checked = false;
  @Input() label = '';
  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
