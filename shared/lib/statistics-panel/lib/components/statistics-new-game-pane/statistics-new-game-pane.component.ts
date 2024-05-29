import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DurationOption, PendingGameOptions } from '@shared/models';

const DEFAULT_PENDING_GAME_OPTIONS: PendingGameOptions = {
  DurationOption: DurationOption.FiveMinutes,
};

/**
 * TODO: Add icons
 */
interface DurationButton {
  label: string;
  durationOption: DurationOption;
}

@Component({
  selector: 'statistics-new-game-pane',
  templateUrl: './statistics-new-game-pane.component.html',
  styleUrl: './statistics-new-game-pane.component.css',
})
export class StatisticsNewGamePaneComponent {
  @Input() hostGameCode = '';
  @Input() gameCodeIsInvalid = false;

  @Output() attemptedToJoinGame = new EventEmitter<string>();
  @Output() hostedGame = new EventEmitter<PendingGameOptions>();
  @Output() joinGameCodeChanged = new EventEmitter<string>();

  readonly durationButtons: DurationButton[] = [
    {
      durationOption: DurationOption.FiveMinutes,
      label: '5 min',
    },
    {
      durationOption: DurationOption.ThreeMinutes,
      label: '3 min',
    },
    {
      durationOption: DurationOption.OneMinute,
      label: '1 min',
    },
  ];

  pendingGameOptions: PendingGameOptions = DEFAULT_PENDING_GAME_OPTIONS;
  joinGameSelected = true;
  name = '';
  joinGameCode = '';

  selectJoinGame() {
    this.joinGameSelected = true;
  }

  selectHostGame() {
    this.joinGameSelected = false;
  }

  hostGame() {
    this.hostedGame.emit(this.pendingGameOptions);
  }

  attemptToJoinGame() {
    this.attemptedToJoinGame.emit(this.joinGameCode);
  }

  selectDurationOption(durationOption: DurationOption) {
    this.pendingGameOptions.DurationOption = durationOption;
  }

  changeJoinGameCode() {
    this.joinGameCodeChanged.emit(this.joinGameCode);
  }
}
