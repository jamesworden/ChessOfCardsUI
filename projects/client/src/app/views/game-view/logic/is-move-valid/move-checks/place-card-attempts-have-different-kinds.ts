import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';

export function placeCardAttemptsHaveDifferentKinds(move: MoveModel) {
  const kinds = new Set<KindModel>();

  for (const placeCardAttempt of move.PlaceCardAttempts) {
    kinds.add(placeCardAttempt.Card.Kind);
  }

  if (kinds.size > 1) {
    return true;
  }

  return false;
}
