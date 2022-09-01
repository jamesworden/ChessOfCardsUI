import { CardModel } from 'src/app/models/card.model';

export function cardsHaveMatchingSuitOrKind(
  card1: CardModel,
  card2: CardModel
) {
  const suitMatches = card1.Suit === card2.Suit;
  const kindMatches = card1.Kind === card2.Kind;

  return suitMatches || kindMatches;
}
