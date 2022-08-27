import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UpdateGameState } from 'src/app/actions/player-game-state.actions';
import { CardModel } from 'src/app/models/card.model';
import { MoveModel } from 'src/app/models/move.model';
import { PlayerGameStateModel } from '../../models/player-game-state-model';
import { SignalrService } from '../../services/SignalRService';
import { PlayerGameState } from '../../state/player-game-state.state';

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

  makeMove(move: MoveModel) {
    const { TargetLaneIndex, TargetRowIndex, Card } = move;

    this.latestGameStateSnapshot.Lanes[TargetLaneIndex].Rows[
      TargetRowIndex
    ].push(Card);

    this.store.dispatch(new UpdateGameState(this.latestGameStateSnapshot));

    this.signalrService.makeMove(move);
  }
}
