import { CardModel } from 'src/app/models/card.model';
import { LaneModel } from 'src/app/models/lane.model';

export function getTopCardOnTargetRow(
  targetLane: LaneModel,
  targetRowIndex: number
): CardModel {
  const targetRow = targetLane.Rows[targetRowIndex];
  const topCard = targetRow[targetRow.length - 1];

  return topCard;
}
