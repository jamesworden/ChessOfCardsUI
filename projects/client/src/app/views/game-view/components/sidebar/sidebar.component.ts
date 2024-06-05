import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { GameState, ResponsiveSizeService } from '@shared/game';
import { BehaviorSubject, Observable, combineLatest, of, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card, CardPosition, PlayerGameView } from '@shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toggleDarkMode } from '../../../../logic/toggle-dark-mode';
import {
  ButtonModalComponent,
  ModalData,
  YesNoButtons,
} from '@shared/ui-inputs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #matDialog = inject(MatDialog);
  readonly #matSnackBar = inject(MatSnackBar);
  readonly #destroyRef = inject(DestroyRef);
  readonly #store = inject(Store);

  @Input({ required: true }) isPlayersTurn = false;
  @Input() cardStack: Card[] | null = [];
  @Input() selectedPosition: CardPosition | null = null;
  @Input() redJokerLaneIndex: number | null = null;
  @Input() blackJokerLaneIndex: number | null = null;
  @Input() isMuted = false;
  @Input() set isShowingMovesPanel(isShowingMovesPanel: boolean) {
    this.isShowingMovesPanel$.next(isShowingMovesPanel);
  }

  @Output() drawOffered = new EventEmitter<void>();
  @Output() passedMove = new EventEmitter<void>();
  @Output() resigned = new EventEmitter<void>();
  @Output() movesPanelToggled = new EventEmitter<void>();
  @Output() muted = new EventEmitter<void>();
  @Output() unmuted = new EventEmitter<void>();

  @Select(GameState.hasPendingDrawOffer)
  hasPendingDrawOffer$!: Observable<boolean>;

  @Select(GameState.drawOfferSent)
  drawOfferSent$!: Observable<boolean>;

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.waitingForServer)
  waitingForServer$!: Observable<boolean>;

  @Select(GameState.gameIsActive)
  gameIsActive$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly isShowingCardStack$ = new BehaviorSubject<boolean>(false);
  readonly isShowingMovesPanel$ = new BehaviorSubject<boolean>(false);

  readonly playerRemainingTime$ = combineLatest([
    this.playerGameView$,
    this.gameIsActive$,
  ]).pipe(
    map(([playerGameView, gameIsActive]) => {
      if (!playerGameView || playerGameView.HasEnded || !gameIsActive) {
        return of(0);
      }

      const isPlayersTurn =
        (playerGameView.IsHost && playerGameView.IsHostPlayersTurn) ||
        (!playerGameView.IsHost && !playerGameView.IsHostPlayersTurn);
      if (isPlayersTurn) {
        return timer(0, 1000);
      }

      return of(0);
    }),
    switchMap((timer) => timer),
    withLatestFrom(this.playerGameView$),
    map(([timeElapsed, playerGameView]) => {
      if (!playerGameView) {
        return this.secondsToRemainingTimeString(0);
      }

      const secondsRemaining = playerGameView.IsHost
        ? playerGameView.HostSecondsRemaining
        : playerGameView.GuestSecondsRemaining;

      return this.secondsToRemainingTimeString(secondsRemaining - timeElapsed);
    })
  );

  readonly opponentRemainingTime$ = combineLatest([
    this.playerGameView$,
    this.gameIsActive$,
  ]).pipe(
    map(([playerGameView, gameIsActive]) => {
      if (!playerGameView || playerGameView.HasEnded || !gameIsActive) {
        return of(0);
      }

      const isOpponentsTurn =
        (playerGameView.IsHost && !playerGameView.IsHostPlayersTurn) ||
        (!playerGameView.IsHost && playerGameView.IsHostPlayersTurn);
      if (isOpponentsTurn) {
        return timer(0, 1000);
      }

      return of(0);
    }),
    switchMap((timer) => timer),
    withLatestFrom(this.playerGameView$),
    map(([timeElapsed, playerGameView]) => {
      if (!playerGameView) {
        return this.secondsToRemainingTimeString(0);
      }

      const secondsRemaining = playerGameView.IsHost
        ? playerGameView.GuestSecondsRemaining
        : playerGameView.HostSecondsRemaining;

      return this.secondsToRemainingTimeString(secondsRemaining - timeElapsed);
    })
  );

  drawOfferSent: boolean;
  hasPendingDrawOffer: boolean;
  numCardsInPlayerDeck: number | null = null;
  numCardsInOpponentDeck: number | null = null;
  playerHasLowTime = false;
  playersRemainingSecondsString = '';
  opponentsRemainingSecondsString = '';

  ngOnInit() {
    this.drawOfferSent$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((drawOfferSent) => {
        this.drawOfferSent = drawOfferSent;
      });
    this.hasPendingDrawOffer$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((hasPendingDrawOffer) => {
        this.hasPendingDrawOffer = hasPendingDrawOffer;
      });
    this.playerGameView$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((playerGameView) => {
        if (playerGameView) {
          this.numCardsInPlayerDeck = playerGameView.NumCardsInPlayersDeck;
          this.numCardsInOpponentDeck = playerGameView.NumCardsInOpponentsDeck;
        }
      });
  }

  attemptToOpenOfferDrawModel() {
    if (!this.#store.selectSnapshot(GameState.gameIsActive)) {
      this.#matSnackBar.open("There's no game in progress.", 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (this.drawOfferSent) {
      this.#matSnackBar.open('You already offered a draw.', 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
    } else if (this.hasPendingDrawOffer) {
      this.#matSnackBar.open('Your opponent already offered a draw.', 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
    } else {
      this.openOfferDrawModal();
    }
  }

  openOfferDrawModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to offer a draw?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.#matDialog.open(ButtonModalComponent, {
      width: '250px',
      maxHeight: '100svh',
      data: modalData,
    });

    modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
      if (selectedOption === YesNoButtons.Yes) {
        this.offerDraw();
      }

      modalRef.close();
    });
  }

  offerDraw() {
    this.drawOffered.emit();
  }

  attemptToOpenPassMoveModal() {
    if (!this.#store.selectSnapshot(GameState.gameIsActive)) {
      this.#matSnackBar.open("There's no game in progress.", 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (!this.isPlayersTurn) {
      this.#matSnackBar.open("It's not your turn.", 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    this.openPassMoveModal();
  }

  openPassMoveModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to pass?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.#matDialog.open(ButtonModalComponent, {
      width: '250px',
      maxHeight: '100svh',
      data: modalData,
    });

    modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
      if (selectedOption === YesNoButtons.Yes) {
        this.passMove();
      }

      modalRef.close();
    });
  }

  passMove() {
    this.passedMove.emit();
  }

  openResignModal() {
    if (!this.#store.selectSnapshot(GameState.gameIsActive)) {
      this.#matSnackBar.open("There's no game in progress.", 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    const modalData: ModalData = {
      message: 'Are you sure you want to resign?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.#matDialog.open(ButtonModalComponent, {
      width: '250px',
      maxHeight: '100svh',
      data: modalData,
    });

    modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
      if (selectedOption === YesNoButtons.Yes) {
        this.resign();
      }

      modalRef.close();
    });
  }

  resign() {
    this.resigned.emit();
  }

  toggleDarkMode() {
    toggleDarkMode();
  }

  toggleMovesPanel() {
    this.movesPanelToggled.emit();
  }

  toggleCardStack() {
    this.isShowingCardStack$.next(!this.isShowingCardStack$.getValue());
  }

  mute() {
    this.muted.emit();
  }

  unmute() {
    this.unmuted.emit();
  }

  private secondsToRemainingTimeString(seconds: number) {
    if (seconds <= 0) {
      return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds
    );
  }
}
