import { Card } from '@shared/models';

export function cardEqualsCard(card1: Card, card2: Card) {
  const kindMatches = card1.kind === card2.kind;
  const suitMatches = card1.suit === card2.suit;
  const cardEqualsCard = kindMatches && suitMatches;

  return cardEqualsCard;
}
