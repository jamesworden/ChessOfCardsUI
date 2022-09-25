import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';

export function getFirstPlaceCardAttempt(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const targetRowIndexes = move.PlaceCardAttempts.map((p) => p.TargetRowIndex);

  const firstTargetRowIndex = gameState.IsHost
    ? Math.min(...targetRowIndexes)
    : Math.max(...targetRowIndexes);

  const firstPlaceCardAttempt = move.PlaceCardAttempts.find(
    (p) => p.TargetRowIndex == firstTargetRowIndex
  )!;

  return firstPlaceCardAttempt;
}
