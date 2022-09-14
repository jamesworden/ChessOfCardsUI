import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { startedMovePlayerSide } from '../started-move-player-side';
import { allPreviousRowsTopCardPlayedByPlayer } from './logic/all-previous-rows-top-card-played-by-player';

export function firstPlaceCardAttemptOutOfOrder(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  if (gameState.IsHost) {
    // return startedMovePlayerSide(gameState, move) ?
    //   allPreviousRowsTopCardPlayedByPlayer()
  } else {
  }

  return false;
}
