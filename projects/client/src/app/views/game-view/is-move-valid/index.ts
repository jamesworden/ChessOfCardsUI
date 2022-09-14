import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { anyPlaceCardAttemptInMiddle } from './move-checks/any-place-card-attempt-in-middle';
import { firstPlaceCardAttemptOutOfOrder } from './move-checks/first-place-card-attempt-out-of-order';
import { moreThanFourPlaceCardAttempts } from './move-checks/more-than-four-place-card-attempts';
import { moveHasNoPlaceCardAttempts } from './move-checks/move-has-no-place-card-attempts';
import { multiplePlaceCardAttemptsOnSameRow } from './move-checks/multiple-place-card-attempts-on-same-row';
import { nonConsecutivePlaceCardAttempts } from './move-checks/non-consecutive-place-card-attempts';
import { notPlayersTurn } from './move-checks/not-players-turn';
import { placeCardAttemptsHaveDifferentKinds } from './move-checks/place-card-attempts-have-different-kinds';
import { placeCardAttemptsTargetDifferentLanes } from './move-checks/place-card-attempts-target-different-lanes';
import { targetLaneHasBeenWon } from './move-checks/target-lane-has-been-won';
import { triedToCaptureGreaterCard } from './move-checks/tried-to-capture-greater-card';
import { triedToReinforceGreaterCard } from './move-checks/tried-to-reinforce-greater-card';
import { triedToReinforceWithDifferentSuit } from './move-checks/tried-to-reinforce-with-different-suit';

export function isMoveValid(gameState: PlayerGameStateModel, move: MoveModel) {
  if (anyPlaceCardAttemptInMiddle(move)) {
    return false;
  }

  if (moveHasNoPlaceCardAttempts(move)) {
    return false;
  }

  if (placeCardAttemptsTargetDifferentLanes(move)) {
    return false;
  }

  if (moreThanFourPlaceCardAttempts(move)) {
    return false;
  }

  if (multiplePlaceCardAttemptsOnSameRow(move)) {
    return false;
  }

  if (nonConsecutivePlaceCardAttempts(move)) {
    return false;
  }

  if (placeCardAttemptsHaveDifferentKinds(move)) {
    return false;
  }

  if (firstPlaceCardAttemptOutOfOrder(gameState, move)) {
    return false;
  }

  if (notPlayersTurn(gameState)) {
    return false;
  }

  if (targetLaneHasBeenWon(gameState, move)) {
    return false;
  }

  if (triedToCaptureGreaterCard(gameState, move)) {
    return false;
  }

  // Simple logic

  if (triedToReinforceWithDifferentSuit(gameState, move)) {
    return false;
  }

  if (triedToReinforceGreaterCard(gameState, move)) {
    return false;
  }

  return true;
}
