import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function targetLaneHasBeenWon(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  for (const placeCardAttempt of move.PlaceCardAttempts) {
    const lane = gameState.Lanes[placeCardAttempt.TargetLaneIndex];

    if (lane.WonBy != PlayerOrNoneModel.None) {
      return true;
    }
  }

  return false;
}
