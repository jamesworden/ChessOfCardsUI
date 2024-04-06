import { Move, PlayerGameView } from '@shared/models';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

/**
 * Checks the first place card attempt of the move.
 */
export function suitOrKindNotMatchLastCardPlayed(
  gameState: PlayerGameView,
  move: Move
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
