import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function startedMovePlayerSideWhenPlayerHasAdvantage(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const startedMoveOnPlayerSide = gameState.IsHost
    ? firstPlaceCardAttempt.TargetRowIndex < 3
    : firstPlaceCardAttempt.TargetRowIndex > 3;
  const lane = gameState.Lanes[firstPlaceCardAttempt.TargetLaneIndex];
  const playerHasAdvantage = gameState.IsHost
    ? lane.LaneAdvantage == PlayerOrNoneModel.Host
    : lane.LaneAdvantage == PlayerOrNoneModel.Guest;

  return startedMoveOnPlayerSide && playerHasAdvantage;
}
