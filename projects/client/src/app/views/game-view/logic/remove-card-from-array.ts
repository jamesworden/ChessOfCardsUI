import { CardModel } from '../../../models/card.model';
import { cardEqualsCard } from './card-equals-card';

export function removeCardFromArray(card: CardModel, cards: CardModel[]) {
  return cards.filter((cardInArray) => !cardEqualsCard(card, cardInArray));
}
