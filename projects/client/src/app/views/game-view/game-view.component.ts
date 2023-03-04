import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy } from '@angular/core';
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
import { ModalComponent } from './components/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionManager } from '../../util/subscription-manager';
import { LaneModel } from '../../models/lane.model';
import { addCardToArray } from './logic/add-card-to-array';
import { moveCardToLane } from './logic/move-card-to-lane';
import { removeCardFromArray } from './logic/remove-card-from-array';
import { convertPlaceMultipleCardsToMove } from './logic/convert-place-multiple-cards-to-move';
import { getCardImageFileName as getCardImageFileNameFn } from '../../util/get-asset-file-names';
import { canPlaceMultipleCards } from './logic/can-place-multiple-cards';
import { ResponsiveSizeService } from './services/responsive-size.service';
import { UpdateView } from '../../actions/view.actions';
import { View } from '..';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

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

  latestGameStateSnapshot: PlayerGameStateModel;
  isPlayersTurn = false;
  isPlacingMultipleCards = false;
  cardSize: number = 64;
  showDrawOptions = false;

  constructor(
    public modal: MatDialog,
    private signalrService: SignalrService,
    private store: Store,
    private snackBar: MatSnackBar,
    private responsiveSizeService: ResponsiveSizeService
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
          this.store.dispatch(new UpdateView(View.Home));
          this.signalrService.gameCode$.next('');
        });
      })
    );
    this.sm.add(
      this.playerGameState$.subscribe((playerGameState) => {
        this.latestGameStateSnapshot = playerGameState;
        this.showDrawOptions = false;

        if (playerGameState) {
          this.setIsPlayersTurn(playerGameState);
        }
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
      this.responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
    this.sm.add(
      this.signalrService.drawOffered$.subscribe(() => {
        this.showDrawOptions = true;
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

    console.log(placeCardAttempt);

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
    const oneListToAnother = event.previousContainer !== event.container;
    const cardPositionChanged =
      event.previousIndex !== event.currentIndex || oneListToAnother;

    if (!cardPositionChanged) {
      return;
    }

    const card = event.item.data as CardModel;

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

    this.latestGameStateSnapshot.Hand.Cards = combinedCards;
    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));
    this.signalrService.rearrangeHand(combinedCards);
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

  private setIsPlayersTurn(playerGameState: PlayerGameStateModel) {
    const { IsHost, IsHostPlayersTurn } = playerGameState;

    const hostAndHostTurn = IsHost && IsHostPlayersTurn;
    const guestAndGuestTurn = !IsHost && !IsHostPlayersTurn;
    this.isPlayersTurn = hostAndHostTurn || guestAndGuestTurn;
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

    if (placeMultipleCardsHand === null) {
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
