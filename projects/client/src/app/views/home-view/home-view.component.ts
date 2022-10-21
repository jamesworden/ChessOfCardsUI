import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent {
  @Output() hostGameButtonClicked = new EventEmitter();
  @Output() joinGameButtonClicked = new EventEmitter();

  currentYear = new Date().getFullYear();

  constructor() {}

  onHostGameClicked() {
    this.hostGameButtonClicked.emit();
  }

  onJoinGameClicked() {
    this.joinGameButtonClicked.emit();
  }
}
