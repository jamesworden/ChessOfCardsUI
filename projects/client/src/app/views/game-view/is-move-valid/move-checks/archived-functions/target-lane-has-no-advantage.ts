import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function noAdvantage(gameState: PlayerGameStateModel, move: MoveModel) {
  const firstPlaceCardAttempt = move.PlaceCardAttempts[0];
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];
  const noAdvantage = lane.LaneAdvantage == PlayerOrNoneModel.None;

  return noAdvantage;
}
