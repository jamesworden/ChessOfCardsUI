import { transferArrayItem } from '@angular/cdk/drag-drop';
import { CardModel } from '../../../models/card.model';

export function addCardToArray(
  card: CardModel,
  cards: CardModel[],
  targetIndex: number
) {
  transferArrayItem([card], cards, 0, targetIndex);
}
