import { Move } from 'projects/client/src/app/models/move.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';

export function getFirstPlaceCardAttempt(
  gameState: PlayerGameView,
  move: Move
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
