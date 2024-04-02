import { Card } from 'projects/client/src/app/models/card.model';
import { Lane } from 'projects/client/src/app/models/lane.model';
import { getCardTiltDegrees } from '../../logic/get-card-tilt-degrees';
import { getPositionBackgroundClass } from '../../logic/get-background-class';

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
