import { PlaceCardAttempt, Card, Move } from '@shared/models';

export function convertPlaceMultipleCardsToMove(
  placeMultipleCards: Card[],
  initialPlaceMultipleCardAttempt: PlaceCardAttempt,
  isHost: boolean
) {
  let { targetLaneIndex: TargetLaneIndex, targetRowIndex: TargetRowIndex } =
    initialPlaceMultipleCardAttempt;

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
      card: Card,
      targetLaneIndex: TargetLaneIndex,
      targetRowIndex: targetRowIndex,
    };

    return placeCardAttempt;
  });

  const move: Move = {
    placeCardAttempts: PlaceCardAttempts,
  };

  return move;
}
