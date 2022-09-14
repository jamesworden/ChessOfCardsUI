import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';

/**
 * Checks the first place card attempt of the move.
 */
export function suitOrKindNotMatchLastCardPlayed(
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

  const { Card, TargetLaneIndex } = firstPlaceCardAttempt;
  const { LastCardPlayed } = gameState.Lanes[TargetLaneIndex];

  if (!LastCardPlayed) {
    return false;
  }

  const suitNotMatch = Card.Suit != LastCardPlayed.Suit;
  const kindNotMatch = Card.Kind != LastCardPlayed.Kind;

  return suitNotMatch && kindNotMatch;
}
