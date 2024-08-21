import { getDefaultBackgroundClasses } from '@shared/logic';
import { PlaceCardAttempt } from '@shared/models';

export interface PseudoPosition {
  backgroundClass: string;
  textClass: string;
  rowIndex: number;
}

export function getPseudoPositions(
  isHost: boolean,
  initialPlaceMultipleCardAttempt: PlaceCardAttempt
) {
  const pseudoPositions: PseudoPosition[] = [];

  for (
    let rowIndex = isHost ? 0 : 6;
    isHost ? rowIndex <= 6 : rowIndex >= 0;
    isHost ? rowIndex++ : rowIndex--
  ) {
    const { targetLaneIndex: TargetLaneIndex } =
      initialPlaceMultipleCardAttempt!;

    const { backgroundClass, textClass } = getDefaultBackgroundClasses(
      TargetLaneIndex,
      rowIndex
    );

    pseudoPositions.push({
      backgroundClass,
      textClass,
      rowIndex,
    });
  }

  return pseudoPositions;
}
