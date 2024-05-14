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
  @Input() buttonClassObj: { [className: string]: boolean } = {};
  @Input() buttonClass = '';
  @Input() activeButtonClass = '';
  @Input() label = '';

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
