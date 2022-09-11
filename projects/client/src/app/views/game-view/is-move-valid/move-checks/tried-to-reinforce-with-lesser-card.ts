import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { cardTrumpsCard } from '../shared-logic/card-trumps-card';

export function triedToReinforceWithLesserCard(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  // Assume each move has one place card attempts
  const { Card, TargetLaneIndex } = move.PlaceCardAttempts[0];
  const targetCard = gameState.Lanes[TargetLaneIndex].LastCardPlayed;

  if (!targetCard) {
    return false;
  }

  const playerPlayedTargetCard = gameState.IsHost
    ? targetCard.PlayedBy == PlayerOrNoneModel.Host
    : targetCard.PlayedBy == PlayerOrNoneModel.Guest;

  return playerPlayedTargetCard && !cardTrumpsCard(Card, targetCard);
}
