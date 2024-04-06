import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';
import { PlayerGameView, PlayerOrNone, Move } from '@shared/models';

export function laneHasNoAdvantage(gameState: PlayerGameView, move: Move) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { TargetLaneIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  return lane.LaneAdvantage === PlayerOrNone.None;
}
