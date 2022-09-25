import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';

export function startedMoveOpponentSide(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const startedMoveOnOpponentSide = gameState.IsHost
    ? firstPlaceCardAttempt.TargetRowIndex > 3
    : firstPlaceCardAttempt.TargetRowIndex < 3;

  return startedMoveOnOpponentSide;
}
