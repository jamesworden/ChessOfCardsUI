import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function triedToReinforceWithDifferentSuit(
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

  const suitNotMatch = Card.Suit != targetCard.Suit;
  const playerPlayedTargetCard = gameState.IsHost
    ? targetCard.PlayedBy == PlayerOrNoneModel.Host
    : targetCard.PlayedBy == PlayerOrNoneModel.Guest;

  return suitNotMatch && playerPlayedTargetCard;
}
