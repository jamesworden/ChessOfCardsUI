import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';
import { PlayerGameStateModel } from '../../../models/player-game-state-model';

export function shouldPlaceMultipleCards(
  placeCardAttempt: PlaceCardAttemptModel,
  latestGameStateSnapshot: PlayerGameStateModel
) {
  const { IsHost, Hand } = latestGameStateSnapshot;
  const defendingAsHost = IsHost && placeCardAttempt.TargetRowIndex < 3;
  const defendingAsGuest = !IsHost && placeCardAttempt.TargetRowIndex > 3;
  const isDefensiveMove = defendingAsHost || defendingAsGuest;

  const hasOtherPotentialPairCards = Hand.Cards.some((card) => {
    const suitNotMatch = card.Suit != placeCardAttempt.Card.Suit;
    const kindMatches = card.Kind === placeCardAttempt.Card.Kind;

    return suitNotMatch && kindMatches;
  });

  const shouldPlaceMultipleCards =
    isDefensiveMove && hasOtherPotentialPairCards;

  return shouldPlaceMultipleCards;
}
