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
import { opponentHasAdvantage } from './move-checks/opponent-has-advantage';
import { playerHasAdvantage } from './move-checks/player-has-advantage';

export function isMoveValid(gameState: PlayerGameStateModel, move: MoveModel) {
  if (notPlayersTurn(gameState)) {
    console.log('[Invalid Move]: It is not the players turn.');
    return false;
  }

  if (moveHasNoPlaceCardAttempts(move)) {
    console.log('[Invalid Move]: The move has no place card attempts.');
    return false;
  }

  if (moreThanFourPlaceCardAttempts(move)) {
    console.log(
      '[Invalid Move]: There are more than four place card attempts in the players move.'
    );
    return false;
  }

  if (anyPlaceCardAttemptInMiddle(move)) {
    console.log('[Invalid Move]: A place card attempt is in the middle.');
    return false;
  }

  if (placeCardAttemptsTargetDifferentLanes(move)) {
    console.log('[Invalid Move]: Place card attempts target different lanes.');
    return false;
  }

  if (placeCardAttemptsTargetSameRow(move)) {
    console.log('[Invalid Move]: Place card attempts target same row.');
    return false;
  }

  if (nonConsecutivePlaceCardAttempts(move)) {
    return false;
  }

  if (placeCardAttemptsHaveDifferentKinds(move)) {
    console.log('[Invalid Move]: Place card attempts have different kinds.');
    return false;
  }

  if (triedToCaptureDistantRow(gameState, move)) {
    console.log('[Invalid Move]: Player tried to capture distant row.');
    return false;
  }

  if (targetLaneHasBeenWon(gameState, move)) {
    console.log('[Invalid Move]: Target lane has been won.');
    return false;
  }

  if (triedToCaptureGreaterCard(gameState, move)) {
    console.log('[Invalid Move]: Player tried to capture greater card.');
    return false;
  }

  if (
    startedMovePlayerSide(gameState, move) &&
    playerHasAdvantage(gameState, move)
  ) {
    console.log(
      '[Invalid Move]: Started move on the player side and the player has advantage.'
    );
    return false;
  }

  if (
    startedMoveOpponentSide(gameState, move) &&
    opponentHasAdvantage(gameState, move)
  ) {
    console.log(
      '[Invalid Move]: Started move on the opponent side and the opponent has an advantage.'
    );
    return false;
  }

  if (
    startedMoveOpponentSide(gameState, move) &&
    laneHasNoAdvantage(gameState, move)
  ) {
    console.log(
      '[Invalid Move]: Started move on the opponent side and the lane has no advantage.'
    );
    return false;
  }

  if (
    suitOrKindNotMatchLastCardPlayed(gameState, move) &&
    !opponentCapturedAnyRowWithAce(gameState)
  ) {
    console.log(
      '[Invalid Move]: Suit or kind not match last card played and the opponent did not capture any row with an ace.'
    );
    return false;
  }

  if (triedToReinforceWithDifferentSuit(gameState, move)) {
    console.log(
      '[Invalid Move]: Player tried to reinforce with different suit.'
    );
    return false;
  }

  if (triedToReinforceGreaterCard(gameState, move)) {
    console.log('[Invalid Move]: Player tried to reinforce with greater card.');
    return false;
  }

  return true;
}
