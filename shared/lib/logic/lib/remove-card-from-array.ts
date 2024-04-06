import { transferArrayItem } from '@angular/cdk/drag-drop';
import { getIndexOfCardInArray } from './get-index-of-card-in-array';
import { Card } from '@shared/models';

export function removeCardFromArray(card: Card, cards: Card[]) {
  const currentIndex = getIndexOfCardInArray(card, cards);

  if (currentIndex === null) {
    return;
  }

  transferArrayItem(cards, [], currentIndex, 0);
}
