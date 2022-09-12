import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function triedToReinforceWithDifferentSuit(
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

  const suitNotMatch = Card.Suit != targetCard.Suit;
  const playerPlayedTargetCard = gameState.IsHost
    ? targetCard.PlayedBy == PlayerOrNoneModel.Host
    : targetCard.PlayedBy == PlayerOrNoneModel.Guest;

  return suitNotMatch && playerPlayedTargetCard;
}
