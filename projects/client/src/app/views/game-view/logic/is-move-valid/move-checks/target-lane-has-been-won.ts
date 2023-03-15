import { Move } from 'projects/client/src/app/models/move.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';

export function targetLaneHasBeenWon(gameState: PlayerGameView, move: Move) {
  for (const placeCardAttempt of move.PlaceCardAttempts) {
    const lane = gameState.Lanes[placeCardAttempt.TargetLaneIndex];

    if (lane.WonBy != PlayerOrNone.None) {
      return true;
    }
  }

  return false;
}
