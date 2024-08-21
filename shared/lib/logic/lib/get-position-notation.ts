import { CardPosition } from '@shared/models';
import { getLaneLetter } from './get-lane-letter';

export function getPositionNotation(cardPosition: CardPosition | null) {
  if (!cardPosition) {
    return null;
  }

  const laneLetter = getLaneLetter(cardPosition.laneIndex);

  return `${laneLetter}${cardPosition.rowIndex + 1}`;
}
