import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';

export function suitOrKindNotMatchLastCardPlayed(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  // TODO: For now, assume each move has one place card attempt
  const { Card, TargetLaneIndex } = move.PlaceCardAttempts[0];
  const { LastCardPlayed } = gameState.Lanes[TargetLaneIndex];

  if (!LastCardPlayed) {
    return false;
  }

  const suitOrKindNotMatch =
    Card.Suit != LastCardPlayed.Suit && Card.Kind != LastCardPlayed.Kind;

  return suitOrKindNotMatch;
}
