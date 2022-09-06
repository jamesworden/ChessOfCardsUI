import { CardModel } from 'projects/client/src/app/models/card.model';
import { LaneModel } from 'projects/client/src/app/models/lane.model';

export function getTopCardOnTargetRow(
  targetLane: LaneModel,
  targetRowIndex: number
): CardModel | null {
  const targetRow = targetLane.Rows[targetRowIndex];
  const targetRowHasCards = targetRow.length != 0;

  if (targetRowHasCards) {
    const topCard = targetRow[targetRow.length - 1];
    return topCard;
  }

  return null;
}
