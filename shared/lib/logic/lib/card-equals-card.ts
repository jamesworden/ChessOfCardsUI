import { Card } from '@shared/models';

export function cardEqualsCard(card1: Card, card2: Card) {
  const kindMatches = card1.Kind === card2.Kind;
  const suitMatches = card1.Suit === card2.Suit;
  const cardEqualsCard = kindMatches && suitMatches;

  return cardEqualsCard;
}
