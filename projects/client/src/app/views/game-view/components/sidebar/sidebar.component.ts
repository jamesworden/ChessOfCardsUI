import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import {
  OfferDraw,
  PassMove,
  ResignGame,
} from 'projects/client/src/app/actions/game.actions';
import { GameState } from 'projects/client/src/app/state/game.state';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { ModalData } from '../modal/modal-data';
import { ModalComponent } from '../modal/modal.component';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { SecondsRemaining } from 'projects/client/src/app/models/seconds-remaining.model';
import { RemainingTimeService } from '../../services/remaining-time.service';

enum YesNoButtons {
  Yes = 'Yes',
  No = 'No',
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Input() isPlayersTurn = false;

  @Select(GameState.hasPendingDrawOffer)
  hasPendingDrawOffer$!: Observable<boolean>;

  @Select(GameState.drawOfferSent)
  drawOfferSent$!: Observable<boolean>;

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView>;

  cardSize: number;
  drawOfferSent: boolean;
  hasPendingDrawOffer: boolean;
  numCardsInPlayerDeck: number | null = null;
  numCardsInOpponentDeck: number | null = null;

  playersRemainingSecondsString = '';
  opponentsRemainingSecondsString = '';

  constructor(
    public responsiveSizeService: ResponsiveSizeService,
    public modal: MatDialog,
    private store: Store,
    private snackBar: MatSnackBar,
    private remainingTimeService: RemainingTimeService
  ) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
    this.sm.add(
      this.drawOfferSent$.subscribe((drawOfferSent) => {
        this.drawOfferSent = drawOfferSent;
      })
    );
    this.sm.add(
      this.hasPendingDrawOffer$.subscribe((hasPendingDrawOffer) => {
        this.hasPendingDrawOffer = hasPendingDrawOffer;
      })
    );
    this.sm.add(
      this.playerGameView$.subscribe((playerGameView) => {
        if (playerGameView) {
          this.numCardsInPlayerDeck = playerGameView.NumCardsInPlayersDeck;
          this.numCardsInOpponentDeck = playerGameView.NumCardsInOpponentsDeck;
        }
      })
    );
    this.sm.add(
      combineLatest([
        this.remainingTimeService.secondsRemainingFromLastMove$,
        this.playerGameView$,
      ]).subscribe(([secondsRemaining, playerGameView]) => {
        if (secondsRemaining) {
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
        }
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  attemptToOpenOfferDrawModel() {
    if (this.drawOfferSent) {
      this.snackBar.open('You already offered a draw.', undefined, {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else if (this.hasPendingDrawOffer) {
      this.snackBar.open(
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

    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
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
    this.store.dispatch(new OfferDraw());

    this.snackBar.open('Offered draw.', undefined, {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  attemptToOpenPassMoveModal() {
    if (this.isPlayersTurn) {
      this.openPassMoveModal();
    } else {
      this.snackBar.open("It's not your turn!", undefined, {
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

    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
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
    this.store.dispatch(new PassMove());

    this.snackBar.open('Move passed.', undefined, {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  openResignModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to resign?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
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
    this.store.dispatch(new ResignGame());
  }

  private secondsToRemainingTimeString(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds
    );
  }
}
