import { Move } from 'projects/client/src/app/models/move.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';

export function startedMovePlayerSide(gameState: PlayerGameView, move: Move) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const startedMoveOnOpponentSide = gameState.IsHost
    ? firstPlaceCardAttempt.TargetRowIndex < 3
    : firstPlaceCardAttempt.TargetRowIndex > 3;

  return startedMoveOnOpponentSide;
}
