import { opponentHasAdvantage } from 'archive/opponent-has-advantage';
import { playerHasAdvantage } from 'archive/player-has-advantage';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { anyPlaceCardAttemptInMiddle } from './move-checks/any-place-card-attempt-in-middle';
import { laneHasNoAdvantage } from './move-checks/lane-has-no-advantage';
import { moreThanFourPlaceCardAttempts } from './move-checks/more-than-four-place-card-attempts';
import { moveHasNoPlaceCardAttempts } from './move-checks/move-has-no-place-card-attempts';
import { placeCardAttemptsTargetSameRow } from './move-checks/place-card-attempts-target-same-row';
import { nonConsecutivePlaceCardAttempts } from './move-checks/non-consecutive-place-card-attempts';
import { notPlayersTurn } from './move-checks/not-players-turn';
import { opponentCapturedAnyRowWithAce } from './move-checks/opponent-captured-any-row-with-ace';
import { placeCardAttemptsHaveDifferentKinds } from './move-checks/place-card-attempts-have-different-kinds';
import { placeCardAttemptsTargetDifferentLanes } from './move-checks/place-card-attempts-target-different-lanes';
import { startedMoveOpponentSide } from './move-checks/started-move-opponent-side';
import { startedMovePlayerSide } from './move-checks/started-move-player-side';
import { suitOrKindNotMatchLastCardPlayed } from './move-checks/suit-or-kind-not-match-last-card-played';
import { targetLaneHasBeenWon } from './move-checks/target-lane-has-been-won';
import { triedToCaptureGreaterCard } from './move-checks/tried-to-capture-greater-card';
import { triedToReinforceGreaterCard } from './move-checks/tried-to-reinforce-greater-card';
import { triedToReinforceWithDifferentSuit } from './move-checks/tried-to-reinforce-with-different-suit';
import { triedToCaptureDistantRow } from './move-checks/tried-to-capture-distant-row';

export function isMoveValid(gameState: PlayerGameStateModel, move: MoveModel) {
  if (notPlayersTurn(gameState)) {
    return false;
  }

  if (moveHasNoPlaceCardAttempts(move)) {
    return false;
  }

  if (anyPlaceCardAttemptInMiddle(move)) {
    return false;
  }

  if (placeCardAttemptsTargetDifferentLanes(move)) {
    return false;
  }

  if (moreThanFourPlaceCardAttempts(move)) {
    return false;
  }

  if (placeCardAttemptsTargetSameRow(move)) {
    return false;
  }

  if (nonConsecutivePlaceCardAttempts(move)) {
    return false;
  }

  if (placeCardAttemptsHaveDifferentKinds(move)) {
    return false;
  }

  if (triedToCaptureDistantRow(gameState, move)) {
    return false;
  }

  if (targetLaneHasBeenWon(gameState, move)) {
    return false;
  }

  if (triedToCaptureGreaterCard(gameState, move)) {
    return false;
  }

  if (
    startedMovePlayerSide(gameState, move) &&
    playerHasAdvantage(gameState, move)
  ) {
    return false;
  }

  if (
    startedMoveOpponentSide(gameState, move) &&
    opponentHasAdvantage(gameState, move)
  ) {
    return false;
  }

  if (
    startedMoveOpponentSide(gameState, move) &&
    laneHasNoAdvantage(gameState, move)
  ) {
    return false;
  }

  if (
    suitOrKindNotMatchLastCardPlayed(gameState, move) &&
    opponentCapturedAnyRowWithAce(gameState)
  ) {
    return false;
  }

  if (triedToReinforceWithDifferentSuit(gameState, move)) {
    return false;
  }

  if (triedToReinforceGreaterCard(gameState, move)) {
    return false;
  }

  return true;
}
