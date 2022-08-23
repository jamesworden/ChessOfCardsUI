import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PlayerGameState } from '../models/player-game-state';
import { SignalrService } from '../services/SignalRService';
import { PlayerGameStateState } from '../state/player-game-state.state';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent {
  gameIsRunning = true;
  gameOverMessage: string | null = null;
  // isHost: boolean;

  playerGameState$: Observable<PlayerGameState>;

  constructor(private store: Store, SignalrService: SignalrService) {
    SignalrService.gameOverMessage$.subscribe((message) => {
      this.gameIsRunning = false;
      this.gameOverMessage = message;
    });

    this.playerGameState$ = this.store.select(PlayerGameStateState.state);
  }

  renderPlayerGameState() {
    // TODO
  }
}
