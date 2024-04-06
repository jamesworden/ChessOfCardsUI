import { PlayerGameView, Move } from '@client/models';
import { getFirstPlaceCardAttempt } from '../logic/get-first-place-card-attempt';
import { startedMoveOpponentSide } from '../started-move-opponent-side';
import { startedMovePlayerSide } from '../started-move-player-side';
import { capturedAllFollowingRows } from './logic/captured-all-following-rows';
import { capturedAllPreviousRows } from './logic/captured-all-previous-rows';

export function triedToCaptureDistantRow(
  gameState: PlayerGameView,
  move: Move
) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);

  if (gameState.IsHost) {
    const startIndex = startedMovePlayerSide(gameState, move) ? 0 : 4;
    return !capturedAllPreviousRows(
      gameState,
      firstPlaceCardAttempt,
      startIndex
    );
  }

  const endIndex = startedMoveOpponentSide(gameState, move) ? 2 : 6;
  return !capturedAllFollowingRows(gameState, firstPlaceCardAttempt, endIndex);
}
