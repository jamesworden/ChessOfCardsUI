import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';
import { PlayerGameStateModel } from '../../../models/player-game-state-model';

/**
 * @returns true if the first place card attempt is in a position where multiple
 * cards can be played after it, otherwise false.
 */
export function shouldPlaceMultipleCards(
  firstPlaceCardAttempt: PlaceCardAttemptModel,
  latestGameStateSnapshot: PlayerGameStateModel
) {
  const { IsHost, Hand } = latestGameStateSnapshot;
  const defendingAsHost = IsHost && firstPlaceCardAttempt.TargetRowIndex < 3;
  const defendingAsGuest = !IsHost && firstPlaceCardAttempt.TargetRowIndex > 3;
  const isDefensiveMove = defendingAsHost || defendingAsGuest;

  const hasOtherPotentialPairCards = Hand.Cards.some((card) => {
    const suitNotMatch = card.Suit != firstPlaceCardAttempt.Card.Suit;
    const kindMatches = card.Kind === firstPlaceCardAttempt.Card.Kind;

    return suitNotMatch && kindMatches;
  });

  const shouldPlaceMultipleCards =
    isDefensiveMove && hasOtherPotentialPairCards;

  return shouldPlaceMultipleCards;
}
