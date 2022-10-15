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

export function getReasonIfMoveInvalid(
  gameState: PlayerGameStateModel,
  move: MoveModel
): string | null {
  if (notPlayersTurn(gameState)) {
    return "It's not your turn!";
  }

  if (moveHasNoPlaceCardAttempts(move)) {
    return 'You need to place a card!';
  }

  if (moreThanFourPlaceCardAttempts(move)) {
    return 'You placed too many cards!';
  }

  if (anyPlaceCardAttemptInMiddle(move)) {
    return "You can't place a card in the middle!";
  }

  if (placeCardAttemptsTargetDifferentLanes(move)) {
    return "You can't place cards on different lanes!";
  }

  if (placeCardAttemptsTargetSameRow(move)) {
    return "You can't place cards on the same position!";
  }

  if (nonConsecutivePlaceCardAttempts(move)) {
    return "You can't place cards that are separate from one another!";
  }

  if (placeCardAttemptsHaveDifferentKinds(move)) {
    return 'Placing multiple cards must be of the same kind!';
  }

  if (triedToCaptureDistantRow(gameState, move)) {
    return "You can't capture this position yet!";
  }

  if (targetLaneHasBeenWon(gameState, move)) {
    return 'This lane was won already!';
  }

  if (triedToCaptureGreaterCard(gameState, move)) {
    return "You can't capture a greater card!";
  }

  if (
    startedMovePlayerSide(gameState, move) &&
    playerHasAdvantage(gameState, move)
  ) {
    return 'You must attack this lane!';
  }

  if (
    startedMoveOpponentSide(gameState, move) &&
    opponentHasAdvantage(gameState, move)
  ) {
    return 'You must defend this lane!';
  }

  if (
    startedMoveOpponentSide(gameState, move) &&
    laneHasNoAdvantage(gameState, move)
  ) {
    return "You aren't ready to attack here yet.";
  }

  if (suitOrKindNotMatchLastCardPlayed(gameState, move)) {
    if (!opponentCapturedAnyRowWithAce(gameState)) {
      return "This card can't be placed here.";
    }
  }

  if (triedToReinforceWithDifferentSuit(gameState, move)) {
    return "Can't reinforce with a different suit!";
  }

  if (triedToReinforceGreaterCard(gameState, move)) {
    return "Can't reinforce a greater card!";
  }

  return null;
}
