import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-view-navbar-button',
  templateUrl: './game-view-navbar-button.component.html',
  styleUrl: './game-view-navbar-button.component.scss',
})
export class GameViewNavbarButtonComponent {
  @Input({ required: true }) iconClass: string;
  @Input({ required: true }) iconString: string;
  @Input({ required: true }) title: string;
  @Input({ required: true }) isActive: boolean;
  @Input({ required: true }) clickable: boolean;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clickable && this.clicked.emit();
  }
}
