import { CardModel } from '../../../models/card.model';
import { cardEqualsCard } from './card-equals-card';

export function cardExistsInArray(card: CardModel, cards: CardModel[]) {
  return cards.some((cardInArray) => cardEqualsCard(card, cardInArray));
}
