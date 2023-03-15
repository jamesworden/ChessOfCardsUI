import { transferArrayItem } from '@angular/cdk/drag-drop';
import { Card } from '../../../models/card.model';

export function addCardToArray(card: Card, cards: Card[], targetIndex: number) {
  transferArrayItem([card], cards, 0, targetIndex);
}
