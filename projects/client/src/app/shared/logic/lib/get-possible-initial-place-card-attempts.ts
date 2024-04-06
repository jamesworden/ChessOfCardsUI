import { Move, PlayerGameView, PlaceCardAttempt } from '@client/models';
import { getReasonIfMoveInvalid } from './is-move-valid';

export function getPossibleInitialPlaceCardAttempts(
  playerGameView: PlayerGameView
) {
  const allInitialMoves = getAllInitialMoves(playerGameView);
  const possibleInitialMoves = allInitialMoves.filter(
    (move) => !getReasonIfMoveInvalid(playerGameView, move)
  );

  const possibleInitialPlaceCardAttempts: PlaceCardAttempt[] = [];

  for (const move of possibleInitialMoves) {
    const attempt = move.PlaceCardAttempts[0];
    if (attempt) {
      possibleInitialPlaceCardAttempts.push(attempt);
    }
  }

  return possibleInitialPlaceCardAttempts;
}

function getAllInitialMoves(playerGameView: PlayerGameView) {
  const allInitialMoves: Move[] = [];

  for (const card of playerGameView.Hand.Cards) {
    for (let targetRowIndex = 0; targetRowIndex < 7; targetRowIndex++) {
      for (let targetLaneIndex = 0; targetLaneIndex < 5; targetLaneIndex++) {
        allInitialMoves.push({
          PlaceCardAttempts: [
            {
              Card: card,
              TargetLaneIndex: targetLaneIndex,
              TargetRowIndex: targetRowIndex,
            },
          ],
        });
      }
    }
  }

  return allInitialMoves;
}
