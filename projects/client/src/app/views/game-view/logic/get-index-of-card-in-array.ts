import { CardModel } from '../../../models/card.model';
import { cardEqualsCard } from './card-equals-card';

export function getIndexOfCardInArray(card: CardModel, cards: CardModel[]) {
  for (let i = 0; i < cards.length; i++) {
    const cardInArray = cards[i];

    if (cardEqualsCard(card, cardInArray)) {
      return i;
    }
  }

  return null;
}
