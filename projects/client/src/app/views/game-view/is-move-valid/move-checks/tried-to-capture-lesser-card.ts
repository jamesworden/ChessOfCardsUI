import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { cardTrumpsCard } from '../shared-logic/card-trumps-card';

export function triedToCaptureLesserCard(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  // Assume all moves are one place card attempt
  const { Card, TargetLaneIndex } = move.PlaceCardAttempts[0];
  const targetCard = gameState.Lanes[TargetLaneIndex].LastCardPlayed;

  if (!targetCard) {
    return false;
  }

  return targetCard.Suit == Card.Suit && !cardTrumpsCard(Card, targetCard);
}
