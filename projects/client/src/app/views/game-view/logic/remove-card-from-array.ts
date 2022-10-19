import { transferArrayItem } from '@angular/cdk/drag-drop';
import { CardModel } from '../../../models/card.model';
import { getIndexOfCardInArray } from './get-index-of-card-in-array';

export function removeCardFromArray(card: CardModel, cards: CardModel[]) {
  const currentIndex = getIndexOfCardInArray(card, cards);

  if (currentIndex === null) {
    return;
  }

  transferArrayItem(cards, [], currentIndex, 0);
}
