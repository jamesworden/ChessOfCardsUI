import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import {
  OfferDraw,
  PassMove,
  ResignGame,
} from '../../../../actions/game.actions';
import { ResponsiveSizeService } from '@shared/game';
import { ModalData } from '../modal/modal-data';
import { ModalComponent } from '../modal/modal.component';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerGameView } from '@shared/models';
import { RemainingTimeService } from '../../services/remaining-time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameState } from '../../../../state/game.state';
import { toggleDarkMode } from '../../../../logic/toggle-dark-mode';

enum YesNoButtons {
  Yes = 'Yes',
  No = 'No',
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #matDialog = inject(MatDialog);
  readonly #store = inject(Store);
  readonly #matSnackBar = inject(MatSnackBar);
  readonly #remainingTimeService = inject(RemainingTimeService);
  readonly #destroyRef = inject(DestroyRef);

  @Input({ required: true }) isPlayersTurn = false;

  @Select(GameState.hasPendingDrawOffer)
  hasPendingDrawOffer$!: Observable<boolean>;

  @Select(GameState.drawOfferSent)
  drawOfferSent$!: Observable<boolean>;

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.waitingForServer)
  waitingForServer$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

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
    this.#remainingTimeService.secondsRemainingFromLastMove$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .pipe(withLatestFrom(this.playerGameView$))
      .subscribe(([secondsRemaining, playerGameView]) => {
        if (secondsRemaining && playerGameView) {
          const { IsHost } = playerGameView;

          const playersRemainingSeconds = IsHost
            ? secondsRemaining.host
            : secondsRemaining.guest;
          const opponentsRemainingSeconds = IsHost
            ? secondsRemaining.guest
            : secondsRemaining.host;

          this.playersRemainingSecondsString =
            this.secondsToRemainingTimeString(playersRemainingSeconds);
          this.opponentsRemainingSecondsString =
            this.secondsToRemainingTimeString(opponentsRemainingSeconds);

          this.playerHasLowTime = playersRemainingSeconds <= 30;
        }
      });
  }

  attemptToOpenOfferDrawModel() {
    if (this.drawOfferSent) {
      this.#matSnackBar.open('You already offered a draw.', undefined, {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else if (this.hasPendingDrawOffer) {
      this.#matSnackBar.open(
        'Your opponent already offered you a draw.',
        undefined,
        {
          duration: 2000,
          verticalPosition: 'top',
        }
      );
    } else {
      this.openOfferDrawModal();
    }
  }

  openOfferDrawModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to offer a draw?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.#matDialog.open(ModalComponent, {
      width: '250px',
      maxHeight: '100dvh',
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
    this.#store.dispatch(new OfferDraw());

    this.#matSnackBar.open('Offered draw.', undefined, {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  attemptToOpenPassMoveModal() {
    if (this.isPlayersTurn) {
      this.openPassMoveModal();
    } else {
      this.#matSnackBar.open("It's not your turn!", undefined, {
        duration: 1500,
        verticalPosition: 'top',
      });
    }
  }

  openPassMoveModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to pass?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.#matDialog.open(ModalComponent, {
      width: '250px',
      maxHeight: '100dvh',
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
    this.#store.dispatch(new PassMove());

    this.#matSnackBar.open('Move passed.', undefined, {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  openResignModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to resign?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.#matDialog.open(ModalComponent, {
      width: '250px',
      maxHeight: '100dvh',
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
    this.#store.dispatch(new ResignGame());
  }

  toggleDarkMode() {
    toggleDarkMode();
  }

  reportBug() {
    // TODO
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
