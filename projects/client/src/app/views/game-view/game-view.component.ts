import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
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
import { HandModel } from '../../models/hand.model';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent {
  @Select(GameState.gameOverMessage)
  gameOverMessage$!: Observable<string>;

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
    this.gameOverMessage$.subscribe((message) => {
      if (!message) {
        return;
      }

      this.openModal(message);
    });

    this.playerGameState$.subscribe((playerGameState) => {
      this.latestGameStateSnapshot = playerGameState;

      const { IsHost, IsHostPlayersTurn } = this.latestGameStateSnapshot;

      const hostAndHostTurn = IsHost && IsHostPlayersTurn;
      const guestAndGuestTurn = !IsHost && !IsHostPlayersTurn;
      this.isPlayersTurn = hostAndHostTurn || guestAndGuestTurn;
    });

    this.signalrService.opponentPassedMove$.subscribe(() => {
      this.snackBar.open('Opponent passed their move.', 'Your turn!', {
        duration: 2000,
        verticalPosition: 'top',
      });
    });

    this.isPlacingMultipleCards$.subscribe((isPlacingMultipleCards) => {
      this.isPlacingMultipleCards = isPlacingMultipleCards;
    });

    this.placeMultipleCards$.subscribe((placeMultipleCards) => {
      if (placeMultipleCards) {
        this.firstPlaceMultipleCardAttempt = placeMultipleCards[0];
        return;
      }

      this.firstPlaceMultipleCardAttempt = null;
    });
  }

  openModal(message: string): void {
    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
      data: { message },
    });

    modalRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  getJokerImageFileName(laneIndex: number) {
    const { RedJokerLaneIndex, BlackJokerLaneIndex } =
      this.latestGameStateSnapshot;

    if (RedJokerLaneIndex === laneIndex) {
      return 'card_joker_red.png';
    }

    if (BlackJokerLaneIndex === laneIndex) {
      return 'card_joker_black.png';
    }

    return null; // Both jokers played already.
  }

  getCardImageFileName(card: CardModel) {
    const { Suit, Kind } = card;
    return `card_${Suit.toLowerCase()}_${Kind.toLowerCase()}.png`;
  }

  getTopCard(row: CardModel[]) {
    const lastIndex = row.length - 1;
    return row[lastIndex];
  }

  rearrangeHand({ previousIndex, currentIndex }: CdkDragDrop<string>) {
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

  dropOntoPlayerHand(event: CdkDragDrop<string>) {
    const Suit = event.item.data.suit as SuitModel;
    const Kind = event.item.data.kind as KindModel;
    const PlayedBy = PlayerOrNoneModel.None;

    const card: CardModel = {
      Suit,
      Kind,
      PlayedBy,
    };

    const cardExistsInHand = this.latestGameStateSnapshot.Hand.Cards.some(
      (card) => card.Kind === Kind && card.Suit === Suit
    );

    if (cardExistsInHand) {
      this.rearrangeHand(event);
      return;
    }

    // this.store.dispatch(new RemoveCardFromMultipleLane(card));
    this.signalrService.rearrangeHand(this.latestGameStateSnapshot.Hand.Cards);
    this.latestGameStateSnapshot.Hand.Cards.push(card);
  }

  passMove() {
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

  attemptMove(placeCardAttempt: PlaceCardAttemptModel) {
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

    const shouldPlaceMultipleCards =
      this.shouldPlaceMultipleCards(placeCardAttempt);

    if (shouldPlaceMultipleCards) {
      const cardsInPlayerHand = this.latestGameStateSnapshot.Hand.Cards.filter(
        (card) => {
          const kindMatches = card.Kind === placeCardAttempt.Card.Kind;
          const suitMatches = card.Suit === placeCardAttempt.Card.Suit;
          const cardMatches = kindMatches && suitMatches;
          return !cardMatches;
        }
      );

      console.log(cardsInPlayerHand);

      this.store.dispatch(
        new StartPlacingMultipleCards(placeCardAttempt, cardsInPlayerHand)
      );

      return;
    }

    for (const placeCardAttempt of move.PlaceCardAttempts) {
      this.moveCardToLane(placeCardAttempt);
      this.removeCardFromHand(placeCardAttempt.Card);
    }

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));

    this.signalrService.makeMove(move);
  }

  cancelPlacingMultipleCards() {
    this.store.dispatch(new FinishPlacingMultipleCards());
  }

  private moveCardToLane(placeCardAttempt: PlaceCardAttemptModel) {
    const { TargetLaneIndex, TargetRowIndex, Card } = placeCardAttempt;
    const targetLane = this.latestGameStateSnapshot.Lanes[TargetLaneIndex];
    const targetRow = targetLane.Rows[TargetRowIndex];
    targetRow.push(Card);
  }

  private removeCardFromHand(card: CardModel) {
    for (let i = 0; i < this.latestGameStateSnapshot.Hand.Cards.length; i++) {
      const cardInHand = this.latestGameStateSnapshot.Hand.Cards[i];
      const sameSuit = card.Suit === cardInHand.Suit;
      const sameKind = card.Kind === cardInHand.Kind;

      if (sameSuit && sameKind) {
        this.latestGameStateSnapshot.Hand.Cards.splice(i, 1);
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
}
