import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  FinishPlacingMultipleCards,
  MakeMove,
  PassMove,
  RearrangeHand,
  ResetGameData,
  ResetPendingGameView,
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
  StartPlacingMultipleCards,
  UpdatePlayerGameView,
} from 'projects/client/src/app/actions/game.actions';
import { Card } from 'projects/client/src/app/models/card.model';
import { Move } from 'projects/client/src/app/models/move.model';
import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';
import { PlayerGameView } from '../../models/player-game-view.model';
import { GameState } from '../../state/game.state';
import { getReasonIfMoveInvalid } from './logic/is-move-valid';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ModalComponent } from './components/modal/modal.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { SubscriptionManager } from '../../util/subscription-manager';
import { Lane } from '../../models/lane.model';
import { addCardToArray } from './logic/add-card-to-array';
import { moveCardToLane } from './logic/move-card-to-lane';
import { removeCardFromArray } from './logic/remove-card-from-array';
import { convertPlaceMultipleCardsToMove } from './logic/convert-place-multiple-cards-to-move';
import { getCardImageFileName as getCardImageFileNameFn } from '../../util/get-asset-file-names';
import { canPlaceMultipleCards } from './logic/can-place-multiple-cards';
import { ResponsiveSizeService } from './services/responsive-size.service';
import { UpdateView } from '../../actions/view.actions';
import { View } from '..';
import { GameOverData } from '../../models/game-over-data.model';
import { Breakpoint } from '../../models/breakpoint.model';
import { getPossibleInitialPlaceCardAttempts } from './logic/get-possible-initial-place-card-attempts';
import { isPlayersTurn } from './logic/is-players-turn';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.isPlacingMultipleCards)
  isPlacingMultipleCards$!: Observable<boolean>;

  @Select(GameState.placeMultipleCardsHand)
  placeMultipleCardsHand$!: Observable<Card[] | null>;

  @Select(GameState.placeMultipleCards)
  placeMultipleCards$!: Observable<Card[] | null>;

  @Select(GameState.initialPlaceMultipleCardAttempt)
  initialPlaceMultipleCardAttempt$!: Observable<PlaceCardAttempt | null>;

  @Select(GameState.gameOverData)
  gameOverData$!: Observable<GameOverData>;

  @Select(GameState.opponentPassedMove)
  opponentPassedMove$!: Observable<boolean>;

  @Select(GameState.hasPendingDrawOffer)
  hasPendingDrawOffer$!: Observable<boolean>;

  @Select(GameState.waitingForServer)
  waitingForServer$!: Observable<boolean>;

  breakpoint$ = this.responsiveSizeService.breakpoint$;

  PlayerOrNone = PlayerOrNone;
  Breakpoint = Breakpoint;
  getCardImageFileName = getCardImageFileNameFn;

  latestGameViewSnapshot: PlayerGameView;
  isPlayersTurn = false;
  isPlacingMultipleCards = false;
  cardSize = 64;
  possibleInitialPlaceCardAttempts: PlaceCardAttempt[] = [];

  constructor(
    public modal: MatDialog,
    private store: Store,
    private snackBar: MatSnackBar,
    private responsiveSizeService: ResponsiveSizeService
  ) {
    this.sm.add(
      this.gameOverData$.subscribe((gameOverData) => {
        if (!gameOverData.isOver) {
          return;
        }

        const modalRef = this.modal.open(ModalComponent, {
          width: '250px',
          data: { message: gameOverData.message },
        });

        modalRef.afterClosed().subscribe(() => {
          this.store.dispatch(new ResetGameData());
          this.store.dispatch(new ResetPendingGameView());
          this.store.dispatch(new UpdateView(View.Home));
        });
      })
    );
    this.sm.add(
      this.playerGameView$.subscribe((playerGameView) => {
        if (playerGameView) {
          this.latestGameViewSnapshot = playerGameView;
          this.isPlayersTurn = isPlayersTurn(playerGameView);
          this.possibleInitialPlaceCardAttempts =
            getPossibleInitialPlaceCardAttempts(playerGameView);
        }
      })
    );
    this.sm.add(
      this.opponentPassedMove$.subscribe((opponentPassedMove) => {
        if (opponentPassedMove) {
          this.snackBar.open('Opponent passed their move.', 'Your turn!', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      })
    );
    this.sm.add(
      this.isPlacingMultipleCards$.subscribe((isPlacingMultipleCards) => {
        this.isPlacingMultipleCards = isPlacingMultipleCards;
      })
    );
    this.sm.add(
      this.responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    if (this.isPlacingMultipleCards) {
      return;
    }

    console.log(placeCardAttempt);

    const move: Move = {
      PlaceCardAttempts: [placeCardAttempt],
    };

    const invalidMoveMessage = getReasonIfMoveInvalid(
      this.latestGameViewSnapshot,
      move
    );

    if (invalidMoveMessage) {
      this.snackBar.open(invalidMoveMessage, undefined, {
        duration: 1500,
        verticalPosition: 'top',
      });

      return;
    }

    canPlaceMultipleCards(placeCardAttempt, this.latestGameViewSnapshot)
      ? this.initiatePlaceMultipleCards(placeCardAttempt)
      : this.makeValidatedMove(move, this.latestGameViewSnapshot.Lanes);
  }

  onPlayerHandCardDrop(event: CdkDragDrop<string>) {
    const oneListToAnother = event.previousContainer !== event.container;
    const cardPositionChanged =
      event.previousIndex !== event.currentIndex || oneListToAnother;

    if (!cardPositionChanged) {
      return;
    }

    const card = event.item.data as Card;

    if (this.isPlacingMultipleCards && oneListToAnother) {
      this.dragCardBackToHand(card, event.currentIndex);
      return;
    }

    this.isPlacingMultipleCards
      ? this.rearrangePlaceMultipleHand(event.previousIndex, event.currentIndex)
      : this.rearrangeHand(event.previousIndex, event.currentIndex);
  }

  onCancelButtonClicked() {
    const placeMultipleCards = this.store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (placeMultipleCards == null) {
      return;
    }

    const placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (placeMultipleCardsHand === null) {
      return;
    }

    const combinedCards = placeMultipleCardsHand.concat(
      placeMultipleCards.reverse()
    );

    this.latestGameViewSnapshot.Hand.Cards = combinedCards;
    this.store.dispatch(new UpdatePlayerGameView(this.latestGameViewSnapshot));
    this.store.dispatch(new RearrangeHand(combinedCards));
    this.store.dispatch(new FinishPlacingMultipleCards());
  }

  onConfirmButtonClicked() {
    const placeMultipleCards = this.store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (placeMultipleCards === null) {
      return;
    }

    const initialPlaceMultipleCardAttempt = this.store.selectSnapshot(
      GameState.initialPlaceMultipleCardAttempt
    );

    if (initialPlaceMultipleCardAttempt === null) {
      return;
    }

    /**
     * Place multiple cards are stored from top to bottom in state. Reverse the array
     * without mutating the original one.
     */
    const reversedPlaceMultipleCards = [...placeMultipleCards].reverse();
    const playerGameView = this.store.selectSnapshot(GameState.playerGameView);

    if (!playerGameView) {
      return;
    }

    const move = convertPlaceMultipleCardsToMove(
      reversedPlaceMultipleCards,
      initialPlaceMultipleCardAttempt,
      playerGameView.IsHost
    );

    const invalidMoveMessage = getReasonIfMoveInvalid(playerGameView, move);

    if (invalidMoveMessage) {
      this.snackBar.open(invalidMoveMessage, 'Out of order!', {
        duration: 1500,
        verticalPosition: 'top',
      });

      return;
    }

    this.store.dispatch(new MakeMove(move));
    this.store.dispatch(new FinishPlacingMultipleCards());
  }

  acceptDraw() {
    this.store.dispatch(new AcceptDrawOffer());
  }

  denyDraw() {
    this.store.dispatch(new DenyDrawOffer());
  }

  private rearrangeHand(previousIndex: number, targetIndex: number) {
    moveItemInArray(
      this.latestGameViewSnapshot.Hand.Cards,
      previousIndex,
      targetIndex
    );

    this.store.dispatch(new UpdatePlayerGameView(this.latestGameViewSnapshot));
    this.store.dispatch(
      new RearrangeHand(this.latestGameViewSnapshot.Hand.Cards)
    );
  }

  private rearrangePlaceMultipleHand(
    previousIndex: number,
    targetIndex: number
  ) {
    const placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (placeMultipleCardsHand === null) {
      return;
    }

    moveItemInArray(placeMultipleCardsHand, previousIndex, targetIndex);

    this.store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));
  }

  private dragCardBackToHand(card: Card, indexInHand: number) {
    const placeMultipleCards = this.store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (placeMultipleCards === null) {
      return;
    }

    removeCardFromArray(card, placeMultipleCards);
    this.store.dispatch(new SetPlaceMultipleCards(placeMultipleCards));

    const placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (placeMultipleCardsHand === null) {
      return;
    }

    addCardToArray(card, placeMultipleCardsHand, indexInHand);
    this.store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));

    const cardsAfterSwitch = this.store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (cardsAfterSwitch === null) {
      return;
    }

    const isLastPlaceMultipleCard = cardsAfterSwitch.length < 1;

    if (!isLastPlaceMultipleCard) {
      return;
    }

    const handAfterSwitch = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (handAfterSwitch === null) {
      return;
    }

    this.store.dispatch(new FinishPlacingMultipleCards());
    this.latestGameViewSnapshot.Hand.Cards = handAfterSwitch;
    this.store.dispatch(new UpdatePlayerGameView(this.latestGameViewSnapshot));
    new RearrangeHand(handAfterSwitch);
  }

  private initiatePlaceMultipleCards(placeCardAttempt: PlaceCardAttempt) {
    const cardsFromHand = [...this.latestGameViewSnapshot.Hand.Cards];
    removeCardFromArray(placeCardAttempt.Card, cardsFromHand);

    this.store.dispatch(
      new StartPlacingMultipleCards(placeCardAttempt, cardsFromHand)
    );
  }

  private makeValidatedMove(move: Move, lanes: Lane[]) {
    for (const placeCardAttempt of move.PlaceCardAttempts) {
      moveCardToLane(placeCardAttempt, lanes);
      removeCardFromArray(
        placeCardAttempt.Card,
        this.latestGameViewSnapshot.Hand.Cards
      );
    }

    this.store.dispatch(new UpdatePlayerGameView(this.latestGameViewSnapshot));
    this.store.dispatch(new MakeMove(move));
  }

  passMove() {
    this.store.dispatch(new PassMove());
  }
}
