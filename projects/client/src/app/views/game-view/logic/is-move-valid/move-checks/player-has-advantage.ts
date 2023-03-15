import { Move } from 'projects/client/src/app/models/move.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function playerHasAdvantage(gameState: PlayerGameView, move: Move) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  return gameState.IsHost
    ? lane.LaneAdvantage === PlayerOrNone.Host
    : lane.LaneAdvantage === PlayerOrNone.Guest;
}
