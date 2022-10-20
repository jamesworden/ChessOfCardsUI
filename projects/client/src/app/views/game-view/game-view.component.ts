import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  FinishPlacingMultipleCards,
  ResetGameData,
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
import { moveCardToLane } from './logic/move-card-to-lane';
import { removeCardFromArray } from './logic/remove-card-from-array';
import { convertPlaceMultipleCardsToMove } from './logic/convert-place-multiple-cards-to-move';
import {
  getCardImageFileName as getCardImageFileNameFn,
  getJokerImageFileName as getJokerImageFileNameFn,
} from '../../util/get-asset-file-names';
import { canPlaceMultipleCards } from './logic/can-place-multiple-cards';

const LIGHT_BLUE_TINT = 'rgba(0, 0, 255, 0.2)';
const LIGHT_RED_TINT = 'rgba(255, 0, 0, 0.2)';

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
  getCardImageFileName = getCardImageFileNameFn;
  getJokerImageFileName = getJokerImageFileNameFn;

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
        console.log(`[Game Over]: ${message}`);

        if (!message) {
          return;
        }

        const modalRef = this.modal.open(ModalComponent, {
          width: '250px',
          data: { message },
        });

        modalRef.afterClosed().subscribe(() => {
          this.store.dispatch(new ResetGameData());
          this.gameEnded.emit();
        });
      })
    );
    this.sm.add(
      this.playerGameState$.subscribe((playerGameState) => {
        this.latestGameStateSnapshot = playerGameState;

        if (!playerGameState) {
          return;
        }

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

    canPlaceMultipleCards(placeCardAttempt, this.latestGameStateSnapshot)
      ? this.initiatePlaceMultipleCards(placeCardAttempt)
      : this.makeValidatedMove(move, this.latestGameStateSnapshot.Lanes);
  }

  onPlayerHandCardDrop(event: CdkDragDrop<string>) {
    const cardPositionChanged = event.previousIndex !== event.currentIndex;

    if (!cardPositionChanged) {
      return;
    }

    const card = event.item.data as CardModel;
    const oneListToAnother = event.previousContainer != event.container;

    if (this.isPlacingMultipleCards && oneListToAnother) {
      this.dragCardBackToHand(card, event.currentIndex);
      return;
    }

    this.isPlacingMultipleCards
      ? this.rearrangePlaceMultipleHand(event.previousIndex, event.currentIndex)
      : this.rearrangeHand(event.previousIndex, event.currentIndex);
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
    const placeMultipleCards = this.store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (!placeMultipleCards) {
      return;
    }

    const placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (!placeMultipleCardsHand) {
      return;
    }

    const combinedCards = placeMultipleCardsHand.concat(
      placeMultipleCards.reverse()
    );

    this.latestGameStateSnapshot.Hand.Cards = combinedCards;
    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));
    this.signalrService.rearrangeHand(combinedCards);
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

    /**
     * Place multiple cards are stored from top to bottom in state. Reverse the array
     * without mutating the original one.
     */
    const reversedPlaceMultipleCards = [...placeMultipleCards].reverse();
    const playerGameState = this.store.selectSnapshot(GameState.gameData);

    const move = convertPlaceMultipleCardsToMove(
      reversedPlaceMultipleCards,
      initialPlaceMultipleCardAttempt,
      playerGameState.IsHost
    );

    const invalidMoveMessage = getReasonIfMoveInvalid(playerGameState, move);

    if (invalidMoveMessage) {
      this.snackBar.open(invalidMoveMessage, 'Out of order!', {
        duration: 1500,
        verticalPosition: 'top',
      });

      return;
    }

    this.signalrService.makeMove(move);
  }

  getTopCard(row: CardModel[]) {
    const lastIndex = row.length - 1;
    return row[lastIndex];
  }

  getCardBackgroundColor(card: CardModel, laneIndex: number) {
    const { Lanes, IsHost } = this.latestGameStateSnapshot;
    const { LastCardPlayed } = Lanes[laneIndex];

    if (!LastCardPlayed) {
      return null;
    }

    if (LastCardPlayed.PlayedBy === PlayerOrNoneModel.None) {
      return null;
    }

    const isLastCardPlayed =
      card.Kind === LastCardPlayed.Kind && card.Suit === LastCardPlayed.Suit;

    if (!isLastCardPlayed) {
      return null;
    }

    const hostAndHostPlayedCard =
      IsHost && LastCardPlayed.PlayedBy === PlayerOrNoneModel.Host;
    const guestAndGuestPlayedCard =
      !IsHost && LastCardPlayed.PlayedBy === PlayerOrNoneModel.Guest;
    const playerPlayedCard = hostAndHostPlayedCard || guestAndGuestPlayedCard;

    return playerPlayedCard ? LIGHT_BLUE_TINT : LIGHT_RED_TINT;
  }

  getLaneBackgroundColor(laneIndex: number) {
    const { Lanes, IsHost } = this.latestGameStateSnapshot;
    const lane = Lanes[laneIndex];

    if (lane.WonBy === PlayerOrNoneModel.None) {
      return null;
    }

    const hostAndHostWonLane = IsHost && lane.WonBy === PlayerOrNoneModel.Host;
    const guestAndGuestWonLane =
      !IsHost && lane.WonBy === PlayerOrNoneModel.Guest;
    const playerWonLane = hostAndHostWonLane || guestAndGuestWonLane;

    return playerWonLane ? LIGHT_BLUE_TINT : LIGHT_RED_TINT;
  }

  private rearrangeHand(previousIndex: number, targetIndex: number) {
    moveItemInArray(
      this.latestGameStateSnapshot.Hand.Cards,
      previousIndex,
      targetIndex
    );

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));
    this.signalrService.rearrangeHand(this.latestGameStateSnapshot.Hand.Cards);
  }

  private rearrangePlaceMultipleHand(
    previousIndex: number,
    targetIndex: number
  ) {
    const placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (!placeMultipleCardsHand) {
      return;
    }

    moveItemInArray(placeMultipleCardsHand, previousIndex, targetIndex);

    this.store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));
  }

  private dragCardBackToHand(card: CardModel, indexInHand: number) {
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
    this.latestGameStateSnapshot.Hand.Cards = handAfterSwitch;
    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));
    this.signalrService.rearrangeHand(handAfterSwitch);
  }

  private initiatePlaceMultipleCards(placeCardAttempt: PlaceCardAttemptModel) {
    const cardsFromHand = [...this.latestGameStateSnapshot.Hand.Cards];
    removeCardFromArray(placeCardAttempt.Card, cardsFromHand);

    this.store.dispatch(
      new StartPlacingMultipleCards(placeCardAttempt, cardsFromHand)
    );
  }

  private makeValidatedMove(move: MoveModel, lanes: LaneModel[]) {
    for (const placeCardAttempt of move.PlaceCardAttempts) {
      moveCardToLane(placeCardAttempt, lanes);
      removeCardFromArray(
        placeCardAttempt.Card,
        this.latestGameStateSnapshot.Hand.Cards
      );
    }

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));
    this.signalrService.makeMove(move);
  }
}
