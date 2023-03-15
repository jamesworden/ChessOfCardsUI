import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';

export function capturedAllPreviousRows(
  gameState: PlayerGameView,
  firstPlaceCardAttempt: PlaceCardAttempt,
  startIndex = 0
) {
  const { TargetLaneIndex, TargetRowIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  for (let i = startIndex; i < TargetRowIndex; i++) {
    const previousRow = lane.Rows[i];
    const previousRowNotOccupied = previousRow.length === 0;

    if (previousRowNotOccupied) {
      return false;
    }

    const topCard = previousRow[previousRow.length - 1];
    const topCardPlayedByPlayer = gameState.IsHost
      ? topCard.PlayedBy == PlayerOrNone.Host
      : topCard.PlayedBy == PlayerOrNone.Guest;

    if (!topCardPlayedByPlayer) {
      return false;
    }
  }

  return true;
}
