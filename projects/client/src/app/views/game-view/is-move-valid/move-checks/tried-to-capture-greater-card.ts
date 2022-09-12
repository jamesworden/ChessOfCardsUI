import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { cardTrumpsCard } from '../shared-logic/card-trumps-card';

export function triedToCaptureGreaterCard(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  // Assume all moves are one place card attempt
  const { Card, TargetLaneIndex, TargetRowIndex } = move.PlaceCardAttempts[0];
  const targetRow = gameState.Lanes[TargetLaneIndex].Rows[TargetRowIndex];

  if (targetRow.length <= 0) {
    return false;
  }

  const targetCard = targetRow[targetRow.length - 1];
  const suitsMatch = targetCard.Suit == Card.Suit;
  const targetCardIsGreater = !cardTrumpsCard(Card, targetCard);

  return suitsMatch && targetCardIsGreater;
}
