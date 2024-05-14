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

  readonly gameViewTabs: {
    iconClass: string;
    iconString: string;
    label: string;
    gameViewTab: GameViewTab;
  }[] = [
    {
      gameViewTab: GameViewTab.Board,
      iconClass: 'material-symbols-outlined',
      iconString: 'grid_view',
      label: 'Board',
    },
    {
      gameViewTab: GameViewTab.Moves,
      iconClass: 'material-symbols-outlined',
      iconString: 'replay',
      label: 'Moves',
    },
    {
      gameViewTab: GameViewTab.Chat,
      iconClass: 'material-symbols-outlined',
      iconString: 'chat',
      label: 'Chat',
    },
  ];

  selectGameViewTab(gameViewTab: GameViewTab) {
    this.tabSelected.emit(gameViewTab);
  }
}
