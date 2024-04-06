import { Move, PlayerGameView } from '@shared/models';

export function startedMovePlayerSide(gameState: PlayerGameView, move: Move) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const startedMoveOnOpponentSide = gameState.IsHost
    ? firstPlaceCardAttempt.TargetRowIndex < 3
    : firstPlaceCardAttempt.TargetRowIndex > 3;

  return startedMoveOnOpponentSide;
}
