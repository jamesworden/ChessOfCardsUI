import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function playerHasAdvantage(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  return gameState.IsHost
    ? lane.LaneAdvantage === PlayerOrNoneModel.Host
    : lane.LaneAdvantage === PlayerOrNoneModel.Guest;
}
