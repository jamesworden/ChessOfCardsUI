import { PlayerGameView, Move, PlayerOrNone } from '@shared/models';

export function targetLaneHasBeenWon(gameState: PlayerGameView, move: Move) {
  for (const placeCardAttempt of move.PlaceCardAttempts) {
    const lane = gameState.Lanes[placeCardAttempt.TargetLaneIndex];

    if (lane.WonBy != PlayerOrNone.None) {
      return true;
    }
  }

  return false;
}
