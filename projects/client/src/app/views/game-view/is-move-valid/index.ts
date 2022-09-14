import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { anyPlaceCardAttemptInMiddle } from './move-checks/any-place-card-attempt-in-middle';

export function isMoveValid(gameState: PlayerGameStateModel, move: MoveModel) {
  if (anyPlaceCardAttemptInMiddle(move)) {
    return false;
  }

  return true;
}
