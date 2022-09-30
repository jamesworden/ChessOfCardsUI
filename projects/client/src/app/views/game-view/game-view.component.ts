import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
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
import { isMoveValid } from './logic/is-move-valid';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent {
  @Select(GameState.gameOverMessage)
  gameOverMessage$: Observable<string>;

  @Select(GameState.gameData)
  playerGameState$: Observable<PlayerGameStateModel>;

  PlayerOrNone = PlayerOrNoneModel;

  latestGameStateSnapshot: PlayerGameStateModel;

  constructor(
    public modal: MatDialog,
    private signalrService: SignalrService,
    private store: Store
  ) {
    this.gameOverMessage$.subscribe((message) => {
      if (!message) {
        return;
      }

      this.openModal(message);
    });

    this.playerGameState$.subscribe((playerGameState) => {
      this.latestGameStateSnapshot = playerGameState;
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
    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));

    const { Cards } = this.latestGameStateSnapshot.Hand;

    this.signalrService.rearrangeHand(Cards);
  }

  drop(event: CdkDragDrop<string>) {
    console.log('player hand', event);
  }

  checkForPairsThenAttemptMove(placeCardAttempt: PlaceCardAttemptModel) {
    // for (const card of this.latestGameStateSnapshot.Hand.Cards) {
    //   if (card.Kind === placeCardAttempt.Card.Kind) {
    //     this.store.dispatch(new StartPlacingMultipleCards(placeCardAttempt));
    //     return;
    //   }
    // }

    const move: MoveModel = {
      PlaceCardAttempts: [placeCardAttempt],
    };

    this.attemptMove(move);
  }

  private attemptMove(move: MoveModel) {
    if (!isMoveValid(this.latestGameStateSnapshot, move)) {
      return;
    }

    for (const placeCardAttempt of move.PlaceCardAttempts) {
      this.moveCardToLane(placeCardAttempt);
      this.removeCardFromHand(placeCardAttempt);
    }

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));

    this.signalrService.makeMove(move);
  }

  private moveCardToLane(placeCardAttempt: PlaceCardAttemptModel) {
    const { TargetLaneIndex, TargetRowIndex, Card } = placeCardAttempt;
    const targetLane = this.latestGameStateSnapshot.Lanes[TargetLaneIndex];
    const targetRow = targetLane.Rows[TargetRowIndex];
    targetRow.push(Card);
  }

  private removeCardFromHand(placeCardAttempt: PlaceCardAttemptModel) {
    for (let i = 0; i < this.latestGameStateSnapshot.Hand.Cards.length; i++) {
      const card = this.latestGameStateSnapshot.Hand.Cards[i];
      const sameSuit = placeCardAttempt.Card.Suit === card.Suit;
      const sameKind = placeCardAttempt.Card.Kind === card.Kind;

      if (sameSuit && sameKind) {
        this.latestGameStateSnapshot.Hand.Cards.splice(i, 1);
      }
    }
  }
}
