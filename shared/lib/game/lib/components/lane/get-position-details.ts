import { getCardTiltDegrees, getPositionBackgroundClass } from '@shared/logic';
import { Card, CardPosition, Lane } from '@shared/models';

export interface PositionDetails {
  topCard?: Card;
  rowIndex: number;
  backgroundClass: string;
  cardRotation: number;
  textClass: string;
  isSelected: boolean;
}

export function getPositionDetails(
  lane: Lane,
  row: Card[],
  isHost: boolean,
  isPlayersTurn: boolean,
  rowIndex: number,
  laneIndex: number,
  selectedPosition: CardPosition | null
) {
  const topCard = row[row.length - 1];

  const isSelected =
    selectedPosition?.laneIndex === laneIndex &&
    selectedPosition?.rowIndex === rowIndex;

  const { positionClass, textClass } = getPositionBackgroundClass(
    lane,
    laneIndex,
    rowIndex,
    isHost,
    isPlayersTurn,
    isSelected,
    topCard
  );

  const cardRotation = topCard
    ? getCardTiltDegrees(topCard, rowIndex, isHost, lane.laneAdvantage)
    : 0;

  const position: PositionDetails = {
    rowIndex,
    backgroundClass: positionClass,
    topCard,
    cardRotation,
    textClass,
    isSelected,
  };

  return position;
}
