import { PlaceCardAttemptModel } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function capturedAllPreviousRows(
  gameState: PlayerGameStateModel,
  firstPlaceCardAttempt: PlaceCardAttemptModel
) {
  const { TargetLaneIndex, TargetRowIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  for (let i = 0; i < TargetRowIndex; i++) {
    const previousRow = lane.Rows[i];
    const previousRowNotOccupied = previousRow.length == 0;

    if (previousRowNotOccupied) {
      return false;
    }

    const topCard = previousRow[previousRow.length - 1];
    const topCardPlayedByPlayer = gameState.IsHost
      ? topCard.PlayedBy == PlayerOrNoneModel.Host
      : topCard.PlayedBy == PlayerOrNoneModel.Guest;

    if (!topCardPlayedByPlayer) {
      return false;
    }
  }

  return true;
}
