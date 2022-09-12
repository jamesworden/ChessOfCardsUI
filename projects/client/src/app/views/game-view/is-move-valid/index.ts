import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { isAnyPlaceCardAttemptInMiddle } from './move-checks/is-any-place-card-attempt-in-middle';
import { moveOnDifferentLanes } from './move-checks/move-on-different-lanes';
import { notPlayersTurn } from './move-checks/not-players-turn';
import { moveHasNoPlaceCardAttempts } from './move-checks/move-has-no-place-card-attempts';
import { startedMoveOpponentSideWhenNoAdvantage } from './move-checks/started-move-opponent-side-when-no-advantage';
import { startedMoveOpponentSideWhenOpponentHasAdvantage } from './move-checks/started-move-opponent-side-when-opponent-has-advantage';
import { startedMovePlayerSideAndPlaceCardOutOfOrder } from './move-checks/started-move-player-side-and-place-card-out-of-order';
import { startedMovePlayerSideWhenPlayerHasAdvantage } from './move-checks/started-move-player-side-when-player-has-advantage';
import { suitOrKindNotMatchAndNotPlayedAceToNukeRow } from './move-checks/suit-or-kind-not-match-and-not-played-ace-to-nuke-row';
import { targetLaneHasBeenWon } from './move-checks/target-lane-has-been-won';
import { triedToCaptureGreaterCard } from './move-checks/tried-to-capture-greater-card';
import { triedToReinforceWithDifferentSuit } from './move-checks/tried-to-reinforce-with-different-suit';
import { triedToReinforceWithLesserCard } from './move-checks/tried-to-reinforce-with-lesser-card';

export function isMoveValid(gameState: PlayerGameStateModel, move: MoveModel) {
  if (notPlayersTurn(gameState)) {
    return false;
  }

  if (moveHasNoPlaceCardAttempts(move)) {
    return false;
  }

  if (moveOnDifferentLanes(move)) {
    return false;
  }

  if (isAnyPlaceCardAttemptInMiddle(move)) {
    return false;
  }

  if (targetLaneHasBeenWon(gameState, move)) {
    return false;
  }

  if (startedMovePlayerSideWhenPlayerHasAdvantage(gameState, move)) {
    return false;
  }

  if (startedMoveOpponentSideWhenOpponentHasAdvantage(gameState, move)) {
    return false;
  }

  if (startedMoveOpponentSideWhenNoAdvantage(gameState, move)) {
    return false;
  }

  if (startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move)) {
    return false;
  }

  if (suitOrKindNotMatchAndNotPlayedAceToNukeRow(gameState, move)) {
    return false;
  }

  if (triedToReinforceWithDifferentSuit(gameState, move)) {
    return false;
  }

  if (triedToReinforceWithLesserCard(gameState, move)) {
    return false;
  }

  if (triedToCaptureGreaterCard(gameState, move)) {
    return false;
  }

  return true;
}
