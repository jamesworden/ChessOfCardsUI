import { Component } from '@angular/core';
import { emptyGameState } from '../constants/empty-game-state';
import { PlayerGameState } from '../models/player-game-state';
import { SignalrService } from '../services/SignalRService';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent {
  gameIsRunning = true;
  gameOverMessage: string | null = null;
  playerGameState: PlayerGameState = emptyGameState;
  // isHost: boolean;

  constructor(SignalrService: SignalrService) {
    SignalrService.gameOverMessage$.subscribe((message) => {
      this.gameIsRunning = false;
      this.gameOverMessage = message;
    });

    SignalrService.playerGameState$.subscribe((playerGameState) => {
      this.playerGameState = playerGameState;
      this.renderPlayerGameState();
    });
  }

  renderPlayerGameState() {
    // TODO
  }
}
