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
import { Select } from '@ngxs/store';
import { ResponsiveSizeService } from '@shared/game';
import { ModalData } from '../modal/modal-data';
import { ModalComponent } from '../modal/modal.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card, CardPosition, PlayerGameView } from '@shared/models';
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
  readonly #matSnackBar = inject(MatSnackBar);
  readonly #remainingTimeService = inject(RemainingTimeService);
  readonly #destroyRef = inject(DestroyRef);

  @Input({ required: true }) isPlayersTurn = false;
  @Input() cardStack: Card[] | null = [];
  @Input() selectedPosition: CardPosition | null = null;
  @Input() redJokerLaneIndex: number | null = null;
  @Input() blackJokerLaneIndex: number | null = null;
  @Input() set isShowingMovesPanel(isShowingMovesPanel: boolean) {
    this.isShowingMovesPanel$.next(isShowingMovesPanel);
  }

  @Output() drawOffered = new EventEmitter<void>();
  @Output() passedMove = new EventEmitter<void>();
  @Output() resigned = new EventEmitter<void>();
  @Output() movesPanelToggled = new EventEmitter<void>();

  @Select(GameState.hasPendingDrawOffer)
  hasPendingDrawOffer$!: Observable<boolean>;

  @Select(GameState.drawOfferSent)
  drawOfferSent$!: Observable<boolean>;

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.waitingForServer)
  waitingForServer$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly isShowingCardStack$ = new BehaviorSubject<boolean>(false);
  readonly isShowingMovesPanel$ = new BehaviorSubject<boolean>(false);

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
        duration: 5000,
        verticalPosition: 'top',
      });
    } else if (this.hasPendingDrawOffer) {
      this.#matSnackBar.open(
        'Your opponent already offered you a draw.',
        undefined,
        {
          duration: 5000,
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
    this.drawOffered.emit();
  }

  attemptToOpenPassMoveModal() {
    if (this.isPlayersTurn) {
      this.openPassMoveModal();
    } else {
      this.#matSnackBar.open("It's not your turn!", undefined, {
        duration: 5000,
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
    this.passedMove.emit();
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
