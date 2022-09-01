import { LaneAdvantageModel } from 'src/app/models/lane-advantage.model';
import { MoveModel } from 'src/app/models/move.model';
import { PlayerGameStateModel } from 'src/app/models/player-game-state-model';
import {
  allFollowingRowsOccupied,
  allPreviousRowsOccupied,
  isPlayersTurn,
} from './valid-move-checks';

export function moveIsValid(move: MoveModel, gameState: PlayerGameStateModel) {
  if (!isPlayersTurn(gameState)) {
    return false;
  }

  const targetLane = gameState.Lanes[move.TargetLaneIndex];
  const laneAdvantage = targetLane.LaneAdvantage;
  const noLaneAdvantage = laneAdvantage == LaneAdvantageModel.None;
  const playerLaneAdvantage = laneAdvantage == LaneAdvantageModel.Player;
  const opponentLaneAdvantage = laneAdvantage == LaneAdvantageModel.Opponent;
  const playerIsHost = gameState.IsHost;
  const attemptedMoveIsHostSide = move.TargetRowIndex < 3;

  if (playerIsHost) {
    if (noLaneAdvantage) {
      if (attemptedMoveIsHostSide) {
        if (allPreviousRowsOccupied(targetLane, move.TargetRowIndex)) {
          return true;
        }
      }
    }
  } else {
    if (noLaneAdvantage) {
      if (!attemptedMoveIsHostSide) {
        if (allFollowingRowsOccupied(targetLane, move.TargetRowIndex)) {
          return true;
        }
      }
    }
  }

  return false;
}
