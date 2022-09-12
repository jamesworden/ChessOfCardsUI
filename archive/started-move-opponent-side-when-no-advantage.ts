import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function startedMoveOpponentSideWhenNoAdvantage(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const startedMoveOnOpponentSide = gameState.IsHost
    ? firstPlaceCardAttempt.TargetRowIndex > 3
    : firstPlaceCardAttempt.TargetRowIndex < 3;
  const lane = gameState.Lanes[firstPlaceCardAttempt.TargetLaneIndex];
  const noAdvantage = lane.LaneAdvantage == PlayerOrNoneModel.None;

  return startedMoveOnOpponentSide && noAdvantage;
}
