import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UpdateGameState } from 'src/app/actions/player-game-state.actions';
import { CardModel } from 'src/app/models/card.model';
import { MoveModel } from 'src/app/models/move.model';
import { PlaceCardAttemptModel } from 'src/app/models/place-card-attempt.model';
import { PlayerGameStateModel } from '../../models/player-game-state-model';
import { SignalrService } from '../../services/SignalRService';
import { PlayerGameState } from '../../state/player-game-state.state';
import { isMoveValid } from './is-move-valid';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent {
  gameIsRunning = true;

  gameOverMessage: string | null = null;

  @Select(PlayerGameState.state)
  playerGameState$: Observable<PlayerGameStateModel>;

  latestGameStateSnapshot: PlayerGameStateModel;

  constructor(private signalrService: SignalrService, private store: Store) {
    this.signalrService.gameOverMessage$.subscribe((message) => {
      this.gameIsRunning = false;
      this.gameOverMessage = message;
    });

    this.playerGameState$.subscribe((playerGameState) => {
      this.latestGameStateSnapshot = playerGameState;
    });
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

  attemptMove(move: MoveModel) {
    // TODO: playing pairs
    // if cards in hand with same kind exist
    // update this move accordingly if the player wants to include these cards

    if (!isMoveValid(move, this.latestGameStateSnapshot)) {
      return;
    }

    for (const placeCardAttempt of move.PlaceCardAttempts) {
      this.moveCardToLane(placeCardAttempt);
      this.removeCardFromHand(placeCardAttempt);
    }

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));

    this.signalrService.makeMove(move);
  }

  moveCardToLane(placeCardAttempt: PlaceCardAttemptModel) {
    const { TargetLaneIndex, TargetRowIndex, Card } = placeCardAttempt;
    const targetLane = this.latestGameStateSnapshot.Lanes[TargetLaneIndex];
    const targetRow = targetLane.Rows[TargetRowIndex];
    targetRow.push(Card);
  }

  removeCardFromHand(placeCardAttempt: PlaceCardAttemptModel) {
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
