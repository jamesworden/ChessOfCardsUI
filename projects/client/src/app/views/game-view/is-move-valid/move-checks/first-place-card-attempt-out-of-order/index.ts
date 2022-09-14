import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { getFirstPlaceCardAttempt } from '../logic/get-first-place-card-attempt';
import { startedMovePlayerSide } from '../started-move-player-side';
import { capturedAllFollowingRows } from './logic/captured-all-following-rows';
import { capturedAllPreviousRows } from './logic/captured-all-previous-rows';

export function firstPlaceCardAttemptOutOfOrder(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { TargetLaneIndex, TargetRowIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  if (gameState.IsHost) {
    return startedMovePlayerSide(gameState, move)
      ? capturedAllPreviousRows(lane, TargetRowIndex, gameState.IsHost)
      : capturedAllFollowingRows(lane, TargetRowIndex, gameState.IsHost);
  } else {
  }

  return false;
}
