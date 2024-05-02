import { CardPosition } from '@shared/models';
import { getLaneLetter } from './get-lane-letter';

export function getPositionNotation(cardPosition: CardPosition | null) {
  if (!cardPosition) {
    return null;
  }

  const laneLetter = getLaneLetter(cardPosition.LaneIndex);

  return `${laneLetter}${cardPosition.RowIndex + 1}`;
}
