import { opponentCapturedAnyRowWithAce } from './is-move-valid/move-checks/opponent-captured-any-row-with-ace';
import { Kind, PlaceCardAttempt, PlayerGameView } from '@shared/models';

/**
 * @returns true if the first place card attempt is in a position where multiple
 * cards can be played after it, otherwise false.
 */
export function canPlaceMultipleCards(
  firstPlaceCardAttempt: PlaceCardAttempt,
  latestGameStateSnapshot: PlayerGameView
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

  if (
    firstPlaceCardAttempt.Card.Kind === Kind.Ace &&
    opponentCapturedAnyRowWithAce(latestGameStateSnapshot)
  ) {
    return false;
  }

  return shouldPlaceMultipleCards;
}
