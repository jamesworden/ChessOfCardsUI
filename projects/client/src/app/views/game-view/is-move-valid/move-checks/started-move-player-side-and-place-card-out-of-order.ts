import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { allFollowingRowsTopCardPlayedByPlayer } from '../shared-logic/all-following-rows-top-card-played-by-player';
import { allPreviousRowsTopCardPlayedByPlayer } from '../shared-logic/all-previous-rows-top-card-played-by-player';

export function startedMovePlayerSideAndPlaceCardOutOfOrder(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const startedMoveOnPlayerSide = gameState.IsHost
    ? firstPlaceCardAttempt.TargetRowIndex < 3
    : firstPlaceCardAttempt.TargetRowIndex > 3;
  const lane = gameState.Lanes[firstPlaceCardAttempt.TargetLaneIndex];
  const placeCardInOrder = gameState.IsHost
    ? allPreviousRowsTopCardPlayedByPlayer(
        lane,
        firstPlaceCardAttempt.TargetRowIndex,
        gameState.IsHost
      )
    : allFollowingRowsTopCardPlayedByPlayer(
        lane,
        firstPlaceCardAttempt.TargetRowIndex,
        gameState.IsHost
      );

  return startedMoveOnPlayerSide && !placeCardInOrder;
}
