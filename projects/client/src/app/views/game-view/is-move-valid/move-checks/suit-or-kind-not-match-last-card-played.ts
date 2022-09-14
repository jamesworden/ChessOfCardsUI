import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

/**
 * Checks the first place card attempt of the move.
 */
export function suitOrKindNotMatchLastCardPlayed(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);

  const { Card, TargetLaneIndex } = firstPlaceCardAttempt;
  const { LastCardPlayed } = gameState.Lanes[TargetLaneIndex];

  if (!LastCardPlayed) {
    return false;
  }

  const suitNotMatch = Card.Suit != LastCardPlayed.Suit;
  const kindNotMatch = Card.Kind != LastCardPlayed.Kind;

  return suitNotMatch && kindNotMatch;
}
