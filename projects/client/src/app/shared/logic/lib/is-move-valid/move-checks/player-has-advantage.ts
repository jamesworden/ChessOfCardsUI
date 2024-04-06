import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';
import { Move, PlayerGameView, PlayerOrNone } from '@client/models';

export function playerHasAdvantage(gameState: PlayerGameView, move: Move) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  return gameState.IsHost
    ? lane.LaneAdvantage === PlayerOrNone.Host
    : lane.LaneAdvantage === PlayerOrNone.Guest;
}
