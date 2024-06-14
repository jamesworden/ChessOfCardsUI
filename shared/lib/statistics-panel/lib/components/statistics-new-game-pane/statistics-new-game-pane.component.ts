import { Component, inject, OnDestroy, HostListener } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import {
  ConnectToServer,
  CreatePendingGame,
  DeletePendingGame,
  GameState,
  JoinGame,
  ResignGame,
  SetGameCodeIsInvalid,
  SetNameIsInvalid,
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
  readonly #matSnackBar = inject(MatSnackBar);

  @Select(GameState.gameCodeIsInvalid)
  gameCodeIsInvalid$: Observable<boolean>;

  @Select(GameState.pendingGameCode)
  pendingGameCode$: Observable<boolean>;

  @Select(GameState.gameIsActive)
  gameIsActive$: Observable<boolean>;

  @Select(GameState.playerGameView)
  playerGameView$: Observable<PlayerGameView>;

  @Select(GameState.nameIsInvalid)
  nameIsInvalid$: Observable<boolean>;

  @Select(GameState.isConnectedToServer)
  isConnectedToServer$: Observable<boolean>;

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
  triedToHostGame = false;
  /**
   * Behind the scenes, our app may try to join the game and fail while reconnecting.
   * If that connection attempt had nothing to do with this component, don't reflect that.
   */
  triedToJoinGame = false;

  constructor() {
    combineLatest([this.pendingGameCode$, this.gameIsActive$])
      .pipe(takeUntilDestroyed())
      .subscribe(([pendingGameCode, gameIsActive]) => {
        if (pendingGameCode || gameIsActive) {
          this.hostOrJoinView = false;
          return;
        }

        if (!gameIsActive || !pendingGameCode) {
          this.hostOrJoinView = true;
        }
      });
  }

  @HostListener('document:keydown.enter')
  handleEnterKey() {
    if (!this.hostOrJoinView) {
      return;
    }

    this.joinGameSelected ? this.attemptToJoinGame() : this.hostGame();
  }

  ngOnDestroy() {
    this.#store.dispatch(new SetGameCodeIsInvalid(false));
    this.#store.dispatch(new SetNameIsInvalid(false));
  }

  selectJoinGame() {
    this.joinGameSelected = true;
  }

  selectHostGame() {
    this.joinGameSelected = false;
  }

  hostGame() {
    this.triedToHostGame = true;

    this.#store.dispatch(
      new CreatePendingGame({
        HostName: this.name,
        ...this.pendingGameOptions,
      })
    );

    if (!this.#store.selectSnapshot(GameState.isConnectedToServer)) {
      this.showRetryConnectionMessage(this.hostGame.bind(this));
    }
  }

  showRetryConnectionMessage(initialAction: () => unknown) {
    this.#store.dispatch(new ConnectToServer());

    const sub = this.#matSnackBar
      .open('Unable to connect to the server!', 'Retry', {
        verticalPosition: 'top',
        duration: 3000,
      })
      .onAction()
      .subscribe(() => {
        initialAction();
        sub.unsubscribe();
      });
  }

  attemptToJoinGame() {
    this.triedToJoinGame = true;

    const upperCaseGameCode = this.joinGameCode.toUpperCase();
    const actualGameCode = this.#store.selectSnapshot(
      GameState.pendingGameCode
    );
    if (
      upperCaseGameCode === actualGameCode ||
      upperCaseGameCode.length !== 4
    ) {
      this.#store.dispatch(new SetGameCodeIsInvalid(true));
      return;
    }

    if (!this.#store.selectSnapshot(GameState.isConnectedToServer)) {
      this.showRetryConnectionMessage(this.attemptToJoinGame.bind(this));
      return;
    }

    this.#store.dispatch(
      new JoinGame({
        gameCode: upperCaseGameCode,
        name: this.name,
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
    this.triedToJoinGame = false;
  }

  selectJoinView() {
    this.joinGameSelected = true;
    this.hostOrJoinView = true;
  }

  nameChanged() {
    this.#store.dispatch(new SetNameIsInvalid(false));
  }

  gameCodeChanged() {
    this.#store.dispatch(new SetGameCodeIsInvalid(false));
  }
}
