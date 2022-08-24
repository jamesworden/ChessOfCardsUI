import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
  // isHost: boolean;

  @Select(PlayerGameState)
  playerGameState$: Observable<PlayerGameStateModel>;

  constructor(SignalrService: SignalrService) {
    SignalrService.gameOverMessage$.subscribe((message) => {
      this.gameIsRunning = false;
      this.gameOverMessage = message;
    });

    this.playerGameState$.subscribe((playerGameState) => {
      this.renderPlayerGameState(playerGameState);
    });
  }

  renderPlayerGameState(playerGameState: PlayerGameStateModel) {
    console.log('Rendering...', playerGameState);
  }
}
