import { transferArrayItem } from '@angular/cdk/drag-drop';
import { Card } from '@shared/models';

export function addCardToArray(card: Card, cards: Card[], targetIndex: number) {
  transferArrayItem([card], cards, 0, targetIndex);
}
