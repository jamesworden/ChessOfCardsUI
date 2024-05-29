import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GameViewTab } from '../../models/game-view-tab';
import { Z_INDEXES } from '@shared/constants';

@Component({
  selector: 'app-game-view-navbar',
  templateUrl: './game-view-navbar.component.html',
  styleUrl: './game-view-navbar.component.scss',
})
export class GameViewNavbarComponent {
  @Input({ required: true }) selectedTab: GameViewTab;
  @Input({ required: true }) numUnreadChatMessages = 0;

  @Output() tabSelected = new EventEmitter<GameViewTab>();

  readonly GameViewTab = GameViewTab;
  readonly Z_INDEXES = Z_INDEXES;

  readonly gameViewTabs: {
    iconClass: string;
    iconString: string;
    label: string;
    gameViewTab: GameViewTab;
  }[] = [
    {
      gameViewTab: GameViewTab.NewGame,
      iconClass: 'material-symbols-outlined',
      iconString: 'add',
      label: 'New Game',
    },
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
