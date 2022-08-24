import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent {
  @Output() clickHostGameEvent = new EventEmitter<string>();
  @Output() clickJoinGameEvent = new EventEmitter<string>();

  constructor() {}

  clickHostGame() {
    this.clickHostGameEvent.emit();
  }

  clickJoinGame() {
    this.clickJoinGameEvent.emit();
  }
}
