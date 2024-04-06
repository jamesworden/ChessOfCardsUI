import { Move, PlayerGameView, PlayerOrNone } from '@client/models';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function triedToReinforceWithDifferentSuit(
  gameState: PlayerGameView,
  move: Move
) {
  const firstPlaceCardAttempt = getFirstPlaceCardAttempt(gameState, move);
  const { Card, TargetLaneIndex, TargetRowIndex } = firstPlaceCardAttempt;
  const targetRow = gameState.Lanes[TargetLaneIndex].Rows[TargetRowIndex];

  if (targetRow.length <= 0) {
    return false;
  }

  const targetCard = targetRow[targetRow.length - 1];

  const suitNotMatch = Card.Suit != targetCard.Suit;
  const playerPlayedTargetCard = gameState.IsHost
    ? targetCard.PlayedBy == PlayerOrNone.Host
    : targetCard.PlayedBy == PlayerOrNone.Guest;

  return suitNotMatch && playerPlayedTargetCard;
}
