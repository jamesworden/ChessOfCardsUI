import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { cardTrumpsCard } from '../shared-logic/card-trumps-card';

export function triedToReinforceGreaterCard(
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

  const playerPlayedTargetCard = gameState.IsHost
    ? targetCard.PlayedBy == PlayerOrNoneModel.Host
    : targetCard.PlayedBy == PlayerOrNoneModel.Guest;

  return playerPlayedTargetCard && !cardTrumpsCard(Card, targetCard);
}
