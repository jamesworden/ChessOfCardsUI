import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PlayerGameStateModel } from '../models/player-game-state-model';
import { SignalrService } from '../services/SignalRService';
import { PlayerGameState } from '../state/player-game-state.state';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent {
  gameIsRunning = true;
  gameOverMessage: string | null = null;
  // isHost: boolean;

  playerGameState$: Observable<PlayerGameStateModel>;

  constructor(private store: Store, SignalrService: SignalrService) {
    SignalrService.gameOverMessage$.subscribe((message) => {
      this.gameIsRunning = false;
      this.gameOverMessage = message;
    });

    this.playerGameState$ = this.store.select(PlayerGameState.state);
  }

  renderPlayerGameState() {
    // TODO
  }
}
