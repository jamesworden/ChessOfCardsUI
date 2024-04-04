import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { getDefaultBackgroundClasses } from '../../logic/get-background-class';

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
    const { TargetLaneIndex } = initialPlaceMultipleCardAttempt!;

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
