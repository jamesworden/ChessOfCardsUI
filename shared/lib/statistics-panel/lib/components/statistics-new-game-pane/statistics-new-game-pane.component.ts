import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { DeletePendingGame, GameState } from '@shared/game';
import { DurationOption, PendingGameOptions } from '@shared/models';
import {
  ButtonModalComponent,
  ModalData,
  YesNoButtons,
} from '@shared/ui-inputs';
import { BehaviorSubject, Observable } from 'rxjs';

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
  readonly #matDialog = inject(MatDialog);
  readonly #store = inject(Store);

  @Output() attemptedToJoinGame = new EventEmitter<string>();
  @Output() hostedGame = new EventEmitter<PendingGameOptions>();
  @Output() joinGameCodeChanged = new EventEmitter<string>();

  @Select(GameState.gameCodeIsInvalid)
  gameCodeIsInvalid$: Observable<boolean>;

  @Select(GameState.pendingGameCode)
  pendingGameCode$: Observable<boolean>;

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
    this.pendingGameCode$
      .pipe(takeUntilDestroyed())
      .subscribe((pendingGameCode) => {
        if (pendingGameCode) {
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

  attemptToLeaveGame() {
    if (
      this.#store.selectSnapshot(GameState.gameIsActive) ||
      this.#store.selectSnapshot(GameState.pendingGameCode)
    ) {
      const modalData: ModalData = {
        message: 'Are you sure you want to leave the game?',
        buttons: [YesNoButtons.Yes, YesNoButtons.No],
      };

      const modalRef = this.#matDialog.open(ButtonModalComponent, {
        width: '250px',
        maxHeight: '100svh',
        data: modalData,
      });

      modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
        if (selectedOption === YesNoButtons.Yes) {
          this.leaveGame();
        }

        modalRef.close();
      });
    } else {
      this.leaveGame();
    }
  }

  leaveGame() {
    this.#store.dispatch(new DeletePendingGame());
    this.selectHostView();
  }

  selectHostView() {
    this.joinGameSelected = false;
    this.hostOrJoinView = true;
  }
}
