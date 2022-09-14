import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { getFirstPlaceCardAttempt } from '../logic/get-first-place-card-attempt';
import { startedMoveOpponentSide } from '../started-move-opponent-side';
import { startedMovePlayerSide } from '../started-move-player-side';
import { capturedAllFollowingRows } from './logic/captured-all-following-rows';
import { capturedAllPreviousRows } from './logic/captured-all-previous-rows';

export function firstPlaceCardAttemptOutOfOrder(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);

  if (gameState.IsHost) {
    const startIndex = startedMovePlayerSide(gameState, move) ? 0 : 3;
    return capturedAllPreviousRows(
      gameState,
      firstPlaceCardAttempt,
      startIndex
    );
  }

  const endIndex = startedMoveOpponentSide(gameState, move) ? 3 : 6;
  return capturedAllFollowingRows(gameState, firstPlaceCardAttempt, endIndex);
}
