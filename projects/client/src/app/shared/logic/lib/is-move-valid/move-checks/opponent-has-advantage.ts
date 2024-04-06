import { Move, PlayerGameView, PlayerOrNone } from '@client/models';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function opponentHasAdvantage(gameState: PlayerGameView, move: Move) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  return gameState.IsHost
    ? lane.LaneAdvantage === PlayerOrNone.Guest
    : lane.LaneAdvantage === PlayerOrNone.Host;
}
