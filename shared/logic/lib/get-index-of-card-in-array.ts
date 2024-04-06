import { Card } from '@client/models';
import { cardEqualsCard } from './card-equals-card';

export function getIndexOfCardInArray(card: Card, cards: Card[]) {
  for (let i = 0; i < cards.length; i++) {
    const cardInArray = cards[i];

    if (cardEqualsCard(card, cardInArray)) {
      return i;
    }
  }

  return null;
}
