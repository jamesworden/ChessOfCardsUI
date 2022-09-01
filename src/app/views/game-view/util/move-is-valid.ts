import { LaneAdvantageModel } from 'src/app/models/lane-advantage.model';
import { MoveModel } from 'src/app/models/move.model';
import { PlayerGameStateModel } from 'src/app/models/player-game-state-model';
import {
  allFollowingRowsOccupied,
  allPreviousRowsOccupied,
  isPlayersTurn,
} from './valid-move-checks';
import { cardsExistOnTargetRow } from './valid-move-checks/cards-exist-on-target-row';
import { cardsHaveMatchingSuitOrKind } from './valid-move-checks/cards-have-matching-suit-or-kind';
import { getTopCardOnTargetRow } from './valid-move-checks/get-top-card-on-target-row';

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
          if (cardsExistOnTargetRow(targetLane, move.TargetRowIndex)) {
            const card = getTopCardOnTargetRow(targetLane, move.TargetRowIndex);

            if (cardsHaveMatchingSuitOrKind(move.Card, card)) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    }
  } else {
    if (noLaneAdvantage) {
      if (!attemptedMoveIsHostSide) {
        if (allFollowingRowsOccupied(targetLane, move.TargetRowIndex)) {
          if (cardsExistOnTargetRow(targetLane, move.TargetRowIndex)) {
            const card = getTopCardOnTargetRow(targetLane, move.TargetRowIndex);

            if (cardsHaveMatchingSuitOrKind(move.Card, card)) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    }
  }

  return false;
}
