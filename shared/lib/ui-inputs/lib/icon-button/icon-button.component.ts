import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  @Input({ required: true }) iconString: string;
  @Input() iconClass = 'material-symbols-outlined';
  @Input() disabled = false;
  @Input() buttonClass = '';
  @Input() activeButtonClass = '';
  @Input() label = '';
  @Input() clickable = true;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clickable && this.clicked.emit();
  }
}
