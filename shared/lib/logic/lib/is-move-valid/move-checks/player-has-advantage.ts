import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';
import { Move, PlayerGameView, PlayerOrNone } from '@shared/models';

export function playerHasAdvantage(gameState: PlayerGameView, move: Move) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  return gameState.IsHost
    ? lane.LaneAdvantage === PlayerOrNone.Host
    : lane.LaneAdvantage === PlayerOrNone.Guest;
}
