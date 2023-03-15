import { Card } from '../../../models/card.model';
import { cardEqualsCard } from './card-equals-card';

export function cardExistsInArray(card: Card, cards: Card[]) {
  return cards.some((cardInArray) => cardEqualsCard(card, cardInArray));
}
