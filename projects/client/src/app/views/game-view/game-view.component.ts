import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  FinishPlacingMultipleCards,
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
import { SuitModel } from '../../models/suit.model';
import { KindModel } from '../../models/kind.model';
import { SubscriptionManager } from '../../util/subscription-manager';

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
      : this.makeMove(move);
  }

  onPlayerHandCardDrop(event: CdkDragDrop<string>) {
    const Suit = event.item.data.suit as SuitModel;
    const Kind = event.item.data.kind as KindModel;
    const PlayedBy = PlayerOrNoneModel.None;

    const card: CardModel = {
      Suit,
      Kind,
      PlayedBy,
    };

    this.isPlacingMultipleCards
      ? this.dragCardBackToHand(card, event.currentIndex)
      : this.rearrangeHand(event, card);
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

  private dragCardBackToHand(card: CardModel, indexInHand: number) {
    const placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (!placeMultipleCardsHand) {
      return;
    }

    const isLastPlaceMultipleCard = placeMultipleCardsHand.length === 1;

    if (isLastPlaceMultipleCard) {
      // Rearrange hand
      // Cancel place multiple cards
      return;
    }

    // Update place multiple cards
    // Update place multiple cards hand
  }

  private moveCardToLane(placeCardAttempt: PlaceCardAttemptModel) {
    const { TargetLaneIndex, TargetRowIndex, Card } = placeCardAttempt;
    const targetLane = this.latestGameStateSnapshot.Lanes[TargetLaneIndex];
    const targetRow = targetLane.Rows[TargetRowIndex];
    targetRow.push(Card);
  }

  private removeCardFromHandLocally(card: CardModel) {
    for (let i = 0; i < this.latestGameStateSnapshot.Hand.Cards.length; i++) {
      const cardInHand = this.latestGameStateSnapshot.Hand.Cards[i];
      const sameSuit = card.Suit === cardInHand.Suit;
      const sameKind = card.Kind === cardInHand.Kind;

      if (sameSuit && sameKind) {
        this.latestGameStateSnapshot.Hand.Cards.splice(i, 1);
        return;
      }
    }
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
    const cardsInPlayerHand = this.latestGameStateSnapshot.Hand.Cards.filter(
      (card) => {
        const kindMatches = card.Kind === placeCardAttempt.Card.Kind;
        const suitMatches = card.Suit === placeCardAttempt.Card.Suit;
        const cardMatches = kindMatches && suitMatches;
        return !cardMatches;
      }
    );

    this.store.dispatch(
      new StartPlacingMultipleCards(placeCardAttempt, cardsInPlayerHand)
    );
  }

  private makeMove(move: MoveModel) {
    for (const placeCardAttempt of move.PlaceCardAttempts) {
      this.moveCardToLane(placeCardAttempt);
      this.removeCardFromHandLocally(placeCardAttempt.Card);
    }

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));

    this.signalrService.makeMove(move);
  }

  private rearrangeHand(event: CdkDragDrop<string>, card: CardModel) {
    this.rearrangeHandLocally(event);
    this.signalrService.rearrangeHand(this.latestGameStateSnapshot.Hand.Cards);
    this.latestGameStateSnapshot.Hand.Cards.push(card);
  }

  private rearrangeHandLocally({
    previousIndex,
    currentIndex,
  }: CdkDragDrop<string>) {
    if (previousIndex === currentIndex) {
      return;
    }

    moveItemInArray(
      this.latestGameStateSnapshot.Hand.Cards,
      previousIndex,
      currentIndex
    );

    const { Cards } = this.latestGameStateSnapshot.Hand;

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));

    this.signalrService.rearrangeHand(Cards);
  }
}
