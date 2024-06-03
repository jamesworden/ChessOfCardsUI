import {
  Component,
  EventEmitter,
  Output,
  inject,
  OnDestroy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import {
  CreatePendingGame,
  DeletePendingGame,
  GameState,
  JoinGame,
  ResignGame,
  SetGameCodeIsInvalid,
} from '@shared/game';
import {
  DurationOption,
  PendingGameOptions,
  PlayerGameView,
} from '@shared/models';
import {
  ButtonModalComponent,
  ModalData,
  YesNoButtons,
} from '@shared/ui-inputs';
import { Observable, combineLatest } from 'rxjs';

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
export class StatisticsNewGamePaneComponent implements OnDestroy {
  readonly #matDialog = inject(MatDialog);
  readonly #store = inject(Store);

  @Select(GameState.gameCodeIsInvalid)
  gameCodeIsInvalid$: Observable<boolean>;

  @Select(GameState.pendingGameCode)
  pendingGameCode$: Observable<boolean>;

  @Select(GameState.gameIsActive)
  gameIsActive$: Observable<boolean>;

  @Select(GameState.playerGameView)
  playerGameView$: Observable<PlayerGameView>;

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
    combineLatest([this.pendingGameCode$, this.gameIsActive$])
      .pipe(takeUntilDestroyed())
      .subscribe(([pendingGameCode, gameIsActive]) => {
        if (pendingGameCode || gameIsActive) {
          this.hostOrJoinView = false;
        }
      });
  }

  ngOnDestroy() {
    this.#store.dispatch(new SetGameCodeIsInvalid(false));
  }

  selectJoinGame() {
    this.joinGameSelected = true;
  }

  selectHostGame() {
    this.joinGameSelected = false;
  }

  hostGame() {
    this.#store.dispatch(new CreatePendingGame(this.pendingGameOptions));
  }

  attemptToJoinGame() {
    const upperCaseGameCode = this.joinGameCode.toUpperCase();
    const actualGameCode = this.#store.selectSnapshot(
      GameState.pendingGameCode
    );
    if (upperCaseGameCode === actualGameCode) {
      this.#store.dispatch(new SetGameCodeIsInvalid(true));
      return;
    }

    this.#store.dispatch(
      new JoinGame(upperCaseGameCode, {
        GuestName: this.name,
      })
    );
  }

  selectDurationOption(durationOption: DurationOption) {
    this.pendingGameOptions.DurationOption = durationOption;
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

    if (this.#store.selectSnapshot(GameState.gameIsActive)) {
      this.#store.dispatch(new ResignGame());
      this.selectJoinView();
      return;
    }

    this.selectHostView();
  }

  selectHostView() {
    this.joinGameSelected = false;
    this.hostOrJoinView = true;
  }

  selectJoinView() {
    this.joinGameSelected = true;
    this.hostOrJoinView = true;
  }
}
