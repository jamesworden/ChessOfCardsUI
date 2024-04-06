import { Kind, Move } from '@shared/models';

export function placeCardAttemptsHaveDifferentKinds(move: Move) {
  const kinds = new Set<Kind>();

  for (const placeCardAttempt of move.PlaceCardAttempts) {
    kinds.add(placeCardAttempt.Card.Kind);
  }

  if (kinds.size > 1) {
    return true;
  }

  return false;
}
