import { CardModel } from '../../../models/card.model';
import { MoveModel } from '../../../models/move.model';
import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';

export function convertPlaceMultipleCardsToMove(
  placeMultipleCards: CardModel[],
  initialPlaceMultipleCardAttempt: PlaceCardAttemptModel,
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

    const placeCardAttempt: PlaceCardAttemptModel = {
      Card,
      TargetLaneIndex,
      TargetRowIndex: targetRowIndex,
    };

    return placeCardAttempt;
  });

  const move: MoveModel = {
    PlaceCardAttempts,
  };

  return move;
}
