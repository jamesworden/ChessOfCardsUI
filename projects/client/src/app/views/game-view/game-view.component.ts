import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  FinishPlacingMultipleCards,
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
  StartPlacingMultipleCards,
  UpdateGameState,
} from 'projects/client/src/app/actions/game.actions';
import { CardModel } from 'projects/client/src/app/models/card.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlaceCardAttemptModel } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { PlayerGameStateModel } from '../../models/player-game-state-model';
import { SignalrService } from '../../services/SignalRService';
import { GameState } from '../../state/game.state';
import { getReasonIfMoveInvalid } from './logic/is-move-valid';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionManager } from '../../util/subscription-manager';
import { LaneModel } from '../../models/lane.model';
import { addCardToArray } from './logic/add-card-to-array';
import { getIndexOfCardInArray } from './logic/get-index-of-card-in-array';
import { moveCardToLane } from './logic/move-card-to-lane';
import { removeCardFromArray } from './logic/remove-card-from-array';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Output() gameEnded = new EventEmitter();

  @Select(GameState.gameData)
  playerGameState$!: Observable<PlayerGameStateModel>;

  @Select(GameState.isPlacingMultipleCards)
  isPlacingMultipleCards$!: Observable<boolean>;

  @Select(GameState.placeMultipleCardsHand)
  placeMultipleCardsHand$!: Observable<CardModel[] | null>;

  @Select(GameState.placeMultipleCards)
  placeMultipleCards$!: Observable<CardModel[] | null>;

  @Select(GameState.initialPlaceMultipleCardAttempt)
  initialPlaceMultipleCardAttempt$!: Observable<PlaceCardAttemptModel | null>;

  PlayerOrNone = PlayerOrNoneModel;

  latestGameStateSnapshot: PlayerGameStateModel;
  isPlayersTurn = false;
  isPlacingMultipleCards = false;
  firstPlaceMultipleCardAttempt: CardModel | null = null;

  constructor(
    public modal: MatDialog,
    private signalrService: SignalrService,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.sm.add(
      this.signalrService.gameOverMessage$.subscribe((message) => {
        console.log(message);

        if (!message) {
          return;
        }

        const modalRef = this.modal.open(ModalComponent, {
          width: '250px',
          data: { message },
        });

        modalRef.afterClosed().subscribe(() => {
          this.gameEnded.emit();
        });
      })
    );
    this.sm.add(
      this.playerGameState$.subscribe((playerGameState) => {
        this.latestGameStateSnapshot = playerGameState;

        const { IsHost, IsHostPlayersTurn } = this.latestGameStateSnapshot;

        const hostAndHostTurn = IsHost && IsHostPlayersTurn;
        const guestAndGuestTurn = !IsHost && !IsHostPlayersTurn;
        this.isPlayersTurn = hostAndHostTurn || guestAndGuestTurn;
      })
    );
    this.sm.add(
      this.signalrService.opponentPassedMove$.subscribe(() => {
        this.snackBar.open('Opponent passed their move.', 'Your turn!', {
          duration: 2000,
          verticalPosition: 'top',
        });
      })
    );
    this.sm.add(
      this.isPlacingMultipleCards$.subscribe((isPlacingMultipleCards) => {
        this.isPlacingMultipleCards = isPlacingMultipleCards;
      })
    );
    this.sm.add(
      this.placeMultipleCards$.subscribe((placeMultipleCards) => {
        if (placeMultipleCards) {
          this.firstPlaceMultipleCardAttempt = placeMultipleCards[0];
          return;
        }

        this.firstPlaceMultipleCardAttempt = null;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  getJokerImageFileName(laneIndex: number) {
    const { RedJokerLaneIndex, BlackJokerLaneIndex } =
      this.latestGameStateSnapshot;

    switch (laneIndex) {
      case RedJokerLaneIndex: {
        return 'card_joker_red.png';
      }
      case BlackJokerLaneIndex: {
        return 'card_joker_black.png';
      }
      default: {
        return null; // Both jokers played already.
      }
    }
  }

  getCardImageFileName(card: CardModel) {
    const { Suit, Kind } = card;
    return `card_${Suit.toLowerCase()}_${Kind.toLowerCase()}.png`;
  }

  getTopCard(row: CardModel[]) {
    const lastIndex = row.length - 1;
    return row[lastIndex];
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttemptModel) {
    if (this.isPlacingMultipleCards) {
      return;
    }

    const move: MoveModel = {
      PlaceCardAttempts: [placeCardAttempt],
    };

    const invalidMoveMessage = getReasonIfMoveInvalid(
      this.latestGameStateSnapshot,
      move
    );

    if (invalidMoveMessage) {
      this.snackBar.open(invalidMoveMessage, undefined, {
        duration: 1500,
        verticalPosition: 'top',
      });

      return;
    }

    this.shouldPlaceMultipleCards(placeCardAttempt)
      ? this.initiatePlaceMultipleCards(placeCardAttempt)
      : this.makeValidatedMove(move, this.latestGameStateSnapshot.Lanes);
  }

  onPlayerHandCardDrop(event: CdkDragDrop<string>) {
    const card = event.item.data;

    if (this.isPlacingMultipleCards) {
      this.dragCardBackToHand(card, event.currentIndex);
      return;
    }

    const cardPositionChanged = event.previousIndex !== event.currentIndex;

    if (cardPositionChanged) {
      this.rearrangeHand(card, event.currentIndex);
    }
  }

  onPassButtonClicked() {
    let snackBarMessage = "It's not your turn!";

    if (this.isPlayersTurn) {
      snackBarMessage = 'Move passed.';
      this.signalrService.passMove();
    }

    this.snackBar.open(snackBarMessage, undefined, {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  onCancelButtonClicked() {
    this.store.dispatch(new FinishPlacingMultipleCards());
  }

  onConfirmButtonClicked() {
    const placeMultipleCards = this.store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (!placeMultipleCards) {
      return;
    }

    const initialPlaceMultipleCardAttempt = this.store.selectSnapshot(
      GameState.initialPlaceMultipleCardAttempt
    );

    if (!initialPlaceMultipleCardAttempt) {
      return;
    }

    let { TargetLaneIndex, TargetRowIndex } = initialPlaceMultipleCardAttempt;
    const { IsHost } = this.store.selectSnapshot(GameState.gameData);

    // Place multiple cards are stored from top to bottom in state. Reverse the array
    // without mutating the original one.
    const placeCardAttempts = [...placeMultipleCards]
      .reverse()
      .map((Card, index) => {
        let targetRowIndex: number;

        if (IsHost) {
          targetRowIndex = TargetRowIndex + index;

          if (targetRowIndex === 3) {
            targetRowIndex++;
            TargetRowIndex++;
          }
        } else {
          targetRowIndex = TargetRowIndex - index;

          if (targetRowIndex === 3) {
            targetRowIndex--;
            TargetRowIndex--;
          }
        }

        const placeCardAttempt: PlaceCardAttemptModel = {
          Card,
          TargetLaneIndex,
          TargetRowIndex: targetRowIndex,
        };

        return placeCardAttempt;
      });

    const move: MoveModel = {
      PlaceCardAttempts: placeCardAttempts,
    };

    this.store.dispatch(new FinishPlacingMultipleCards());
    this.signalrService.makeMove(move);
  }

  private dragCardBackToHand(card: CardModel, indexInHand: number) {
    const placeMultipleCards = this.store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (!placeMultipleCards) {
      return;
    }

    const isLastPlaceMultipleCard = placeMultipleCards.length === 1;

    if (isLastPlaceMultipleCard) {
      this.rearrangeHand(card, indexInHand);
      this.store.dispatch(new FinishPlacingMultipleCards());
      return;
    }

    removeCardFromArray(card, placeMultipleCards);
    this.store.dispatch(new SetPlaceMultipleCards(placeMultipleCards));

    const placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (!placeMultipleCardsHand) {
      return;
    }

    addCardToArray(card, placeMultipleCardsHand, indexInHand);
    this.store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));
  }

  private shouldPlaceMultipleCards(placeCardAttempt: PlaceCardAttemptModel) {
    const { IsHost } = this.latestGameStateSnapshot;
    const defendingAsHost = IsHost && placeCardAttempt.TargetRowIndex < 3;
    const defendingAsGuest = !IsHost && placeCardAttempt.TargetRowIndex > 3;
    const isDefensiveMove = defendingAsHost || defendingAsGuest;

    const hasOtherPotentialPairCards =
      this.latestGameStateSnapshot.Hand.Cards.some((card) => {
        const suitNotMatch = card.Suit != placeCardAttempt.Card.Suit;
        const kindMatches = card.Kind === placeCardAttempt.Card.Kind;

        return suitNotMatch && kindMatches;
      });

    const shouldPlaceMultipleCards =
      isDefensiveMove && hasOtherPotentialPairCards;

    return shouldPlaceMultipleCards;
  }

  private initiatePlaceMultipleCards(placeCardAttempt: PlaceCardAttemptModel) {
    const cardsFromHand = [...this.latestGameStateSnapshot.Hand.Cards];
    const remainingCardsFromHand = removeCardFromArray(
      placeCardAttempt.Card,
      cardsFromHand
    );

    this.store.dispatch(
      new StartPlacingMultipleCards(placeCardAttempt, remainingCardsFromHand)
    );
  }

  private makeValidatedMove(move: MoveModel, lanes: LaneModel[]) {
    for (const placeCardAttempt of move.PlaceCardAttempts) {
      moveCardToLane(placeCardAttempt, lanes);
      this.latestGameStateSnapshot.Hand.Cards = removeCardFromArray(
        placeCardAttempt.Card,
        this.latestGameStateSnapshot.Hand.Cards
      );
    }

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));
    this.signalrService.makeMove(move);
  }

  private rearrangeHand(card: CardModel, indexInHand: number) {
    const { Cards } = this.latestGameStateSnapshot.Hand;

    const currentIndex = getIndexOfCardInArray(card, Cards);

    if (!currentIndex) {
      return;
    }

    moveItemInArray(
      this.latestGameStateSnapshot.Hand.Cards,
      currentIndex,
      indexInHand
    );

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));
    this.signalrService.rearrangeHand(Cards);
  }
}
