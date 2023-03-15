import { Move } from 'projects/client/src/app/models/move.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
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
