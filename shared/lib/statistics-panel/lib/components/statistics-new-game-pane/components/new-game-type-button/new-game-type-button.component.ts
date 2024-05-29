import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'new-game-type-button',
  templateUrl: './new-game-type-button.component.html',
  styleUrl: './new-game-type-button.component.css',
})
export class NewGameTypeButtonComponent {
  @Input() label = '';
  @Input() selected = false;

  @Output() newGameTypeSelected = new EventEmitter<void>();

  selectNewGameType() {
    this.newGameTypeSelected.emit();
  }
}
