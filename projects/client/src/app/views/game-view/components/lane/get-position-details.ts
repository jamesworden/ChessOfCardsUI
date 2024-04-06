import { Card, Lane } from '@client/models';
import { getCardTiltDegrees } from '../../../../shared/logic/lib/get-card-tilt-degrees';
import { getPositionBackgroundClass } from '../../../../shared/logic/lib/get-background-class';

export interface PositionDetails {
  topCard?: Card;
  rowIndex: number;
  backgroundClass: string;
  cardRotation: number;
  textClass: string;
}

export function getPositionDetails(
  lane: Lane,
  row: Card[],
  isHost: boolean,
  isPlayersTurn: boolean,
  rowIndex: number,
  laneIndex: number
) {
  const topCard = row[row.length - 1];

  const { positionClass, textClass } = getPositionBackgroundClass(
    lane,
    laneIndex,
    rowIndex,
    isHost,
    isPlayersTurn,
    topCard
  );

  const cardRotation = topCard
    ? getCardTiltDegrees(topCard, rowIndex, isHost, lane.LaneAdvantage)
    : 0;

  const position: PositionDetails = {
    rowIndex,
    backgroundClass: positionClass,
    topCard,
    cardRotation,
    textClass,
  };

  return position;
}
