import { LaneModel } from 'src/app/models/lane.model';

export function cardsExistOnTargetRow(
  targetLane: LaneModel,
  targetRowIndex: number
) {
  const numCardsOnTargetRow = targetLane.Rows[targetRowIndex].length;
  return numCardsOnTargetRow > 0;
}
