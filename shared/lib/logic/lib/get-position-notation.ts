import { CardPosition } from '@shared/models';

export function getPositionNotation(cardPosition: CardPosition | null) {
  if (!cardPosition) {
    return null;
  }

  const laneLetter = getLaneLetter(cardPosition.LaneIndex);

  return `${laneLetter}${cardPosition.RowIndex}`;
}

function getLaneLetter(laneIndex: number): string {
  switch (laneIndex) {
    case 0:
      return 'a';
    case 1:
      return 'b';
    case 2:
      return 'c';
    case 3:
      return 'd';
    case 4:
      return 'e';
    default:
      return '';
  }
}
