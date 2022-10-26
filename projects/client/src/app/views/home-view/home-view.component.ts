import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent {
  @Output() howToPlayClicked = new EventEmitter();
  @Output() playAsGuestClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();

  currentYear = new Date().getFullYear();

  constructor() {}

  onHowToPlay() {
    this.howToPlayClicked.emit();
  }

  onPlayAsGuest() {
    this.playAsGuestClicked.emit();
  }

  onLogin() {
    this.loginClicked.emit();
  }
}
