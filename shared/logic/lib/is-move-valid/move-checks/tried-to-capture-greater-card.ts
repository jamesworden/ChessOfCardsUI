import { PlayerGameView, Move } from '@client/models';
import { cardTrumpsCard } from './logic/card-trumps-card';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function triedToCaptureGreaterCard(
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
  const suitsMatch = targetCard.Suit == Card.Suit;
  const targetCardIsGreater = !cardTrumpsCard(Card, targetCard);

  return suitsMatch && targetCardIsGreater;
}
