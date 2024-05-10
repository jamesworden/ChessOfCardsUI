import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GameViewTab } from '../../models/game-view-tab';

@Component({
  selector: 'app-game-view-navbar',
  templateUrl: './game-view-navbar.component.html',
  styleUrl: './game-view-navbar.component.scss',
})
export class GameViewNavbarComponent {
  @Input({ required: true }) selectedTab: GameViewTab;

  @Output() tabSelected = new EventEmitter<GameViewTab>();

  readonly GameViewTab = GameViewTab;

  selectGameViewTab(gameViewTab: GameViewTab) {
    this.tabSelected.emit(gameViewTab);
  }
}
