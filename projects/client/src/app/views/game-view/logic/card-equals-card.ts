import { CardModel } from '../../../models/card.model';

export function cardEqualsCard(card1: CardModel, card2: CardModel) {
  const kindMatches = card1.Kind === card2.Kind;
  const suitMatches = card1.Suit === card2.Suit;
  const cardEqualsCard = kindMatches && suitMatches;

  return cardEqualsCard;
}
