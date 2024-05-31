import { Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DurationOption, PendingGameOptions } from '@shared/models';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_PENDING_GAME_OPTIONS: PendingGameOptions = {
  DurationOption: DurationOption.FiveMinutes,
};

interface DurationButton {
  label: string;
  durationOption: DurationOption;
  icon: string;
  iconClass: string;
}

@Component({
  selector: 'statistics-new-game-pane',
  templateUrl: './statistics-new-game-pane.component.html',
  styleUrl: './statistics-new-game-pane.component.css',
})
export class StatisticsNewGamePaneComponent {
  @Input() gameCodeIsInvalid = false;
  @Input() set hostGameCode(hostedGameCode: string) {
    this.hostedGameCode$.next(hostedGameCode);
  }

  @Output() attemptedToJoinGame = new EventEmitter<string>();
  @Output() hostedGame = new EventEmitter<PendingGameOptions>();
  @Output() joinGameCodeChanged = new EventEmitter<string>();

  readonly hostedGameCode$ = new BehaviorSubject<string | null>(null);

  readonly durationButtons: DurationButton[] = [
    {
      durationOption: DurationOption.FiveMinutes,
      label: '5 min',
      icon: 'pace',
      iconClass: 'material-symbols-outlined',
    },
    {
      durationOption: DurationOption.ThreeMinutes,
      label: '3 min',
      icon: 'avg_pace',
      iconClass: 'material-symbols-outlined',
    },
    {
      durationOption: DurationOption.OneMinute,
      label: '1 min',
      icon: 'bolt',
      iconClass: 'material-symbols-outlined',
    },
  ];

  pendingGameOptions: PendingGameOptions = DEFAULT_PENDING_GAME_OPTIONS;
  joinGameSelected = true;
  hostOrJoinView = true;
  name = '';
  joinGameCode = '';

  constructor() {
    this.hostedGameCode$
      .pipe(takeUntilDestroyed())
      .subscribe((hostedGameCode) => {
        if (hostedGameCode) {
          this.hostOrJoinView = false;
        }
      });
  }

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

  selectHostView() {
    this.joinGameSelected = false;
    this.hostOrJoinView = true;
  }
}
