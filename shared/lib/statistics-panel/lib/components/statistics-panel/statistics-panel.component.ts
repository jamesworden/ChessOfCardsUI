import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage, MoveMade, PendingGameOptions } from '@shared/models';
import { BehaviorSubject } from 'rxjs';
import { MoveNotation } from '@shared/logic';
import { StatisticsPanelView } from '../../models/statistics-panel-view';
import { StatisticsPane } from '../../models/statistics-pane';

@Component({
  selector: 'statistics-panel',
  templateUrl: './statistics-panel.component.html',
  styleUrl: './statistics-panel.component.scss',
})
export class StatisticsPanelComponent {
  readonly StatisticsPanelView = StatisticsPanelView;

  @Input({ required: true }) chatMessages: ChatMessage[] = [];
  @Input({ required: true }) moveNotations: MoveNotation[] = [];
  @Input({ required: true }) selectedNotationIndex: number | null = null;
  @Input({ required: true }) currentPanelView: StatisticsPanelView | null =
    null;
  @Input({ required: true }) numUnreadChatMessages = 0;
  @Input({ required: true }) gameCode: string;
  @Input({ required: true }) gameCodeIsInvalid: boolean;
  @Input({ required: true }) set isHost(isHost: boolean) {
    this.isHost$.next(isHost);
  }

  @Output() moveNotationSelected = new EventEmitter<number>();
  @Output() chatMessageSent = new EventEmitter<string>();
  @Output() panelViewSelected = new EventEmitter<StatisticsPanelView>();
  @Output() attemptedToJoinGame = new EventEmitter<string>();
  @Output() hostedGame = new EventEmitter<PendingGameOptions>();
  @Output() joinGameCodeChanged = new EventEmitter<string>();

  readonly movesMade$ = new BehaviorSubject<MoveMade[]>([]);
  readonly isHost$ = new BehaviorSubject<boolean>(false);

  readonly panes: StatisticsPane[] = [
    {
      iconClass: 'material-symbols-outlined',
      iconString: 'add',
      title: 'New Game',
      panelView: StatisticsPanelView.NewGame,
    },
    {
      iconClass: 'material-symbols-outlined',
      iconString: 'replay',
      title: 'Moves',
      panelView: StatisticsPanelView.Moves,
    },
    {
      iconClass: 'material-symbols-outlined',
      iconString: 'chat',
      title: 'Chat',
      panelView: StatisticsPanelView.Chat,
    },
  ];

  selectMoveNotation(moveSelectedIndex: number) {
    this.moveNotationSelected.emit(moveSelectedIndex);
  }

  selectPane(panelView: StatisticsPanelView) {
    this.panelViewSelected.emit(panelView);
  }

  sendChatMessage(chatMessage: string) {
    this.chatMessageSent.emit(chatMessage);
  }

  attemptToJoinGame(gameCode: string) {
    this.attemptedToJoinGame.emit(gameCode);
  }

  hostGame(pendingGameOptions: PendingGameOptions) {
    this.hostedGame.emit(pendingGameOptions);
  }

  changeJoinGameCode(gameCode: string) {
    this.joinGameCodeChanged.emit(gameCode);
  }
}
