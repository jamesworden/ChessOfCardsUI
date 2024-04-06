import { PlaceCardAttempt, Card, Move } from '@shared/models';

export function convertPlaceMultipleCardsToMove(
  placeMultipleCards: Card[],
  initialPlaceMultipleCardAttempt: PlaceCardAttempt,
  isHost: boolean
) {
  let { TargetLaneIndex, TargetRowIndex } = initialPlaceMultipleCardAttempt;

  const PlaceCardAttempts = placeMultipleCards.map((Card, index) => {
    let targetRowIndex: number;

    if (isHost) {
      targetRowIndex = TargetRowIndex + index;

      if (targetRowIndex === 3) {
        targetRowIndex++;
        TargetRowIndex++;
      }
    } else {
      targetRowIndex = TargetRowIndex - index;

      if (targetRowIndex === 3) {
        targetRowIndex--;
        TargetRowIndex--;
      }
    }

    const placeCardAttempt: PlaceCardAttempt = {
      Card,
      TargetLaneIndex,
      TargetRowIndex: targetRowIndex,
    };

    return placeCardAttempt;
  });

  const move: Move = {
    PlaceCardAttempts,
  };

  return move;
}
