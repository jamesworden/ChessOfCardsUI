import { Move } from 'projects/client/src/app/models/move.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';
import { cardTrumpsCard } from './logic/card-trumps-card';
import { getFirstPlaceCardAttempt } from './logic/get-first-place-card-attempt';

export function triedToReinforceGreaterCard(
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

  const playerPlayedTargetCard = gameState.IsHost
    ? targetCard.PlayedBy == PlayerOrNone.Host
    : targetCard.PlayedBy == PlayerOrNone.Guest;

  return playerPlayedTargetCard && !cardTrumpsCard(Card, targetCard);
}
