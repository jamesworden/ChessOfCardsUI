import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { cardTrumpsCard } from './logic/card-trumps-card';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function triedToCaptureGreaterCard(
  gameState: PlayerGameStateModel,
  move: MoveModel
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
