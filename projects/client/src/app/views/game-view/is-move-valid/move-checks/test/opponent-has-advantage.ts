import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function opponentHasAdvantage(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];
  const playerHasAdvantage = gameState.IsHost
    ? lane.LaneAdvantage === PlayerOrNoneModel.Guest
    : lane.LaneAdvantage === PlayerOrNoneModel.Host;

  return playerHasAdvantage;
}
