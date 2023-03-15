import { Kind } from 'projects/client/src/app/models/kind.model';
import { Move } from 'projects/client/src/app/models/move.model';

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
