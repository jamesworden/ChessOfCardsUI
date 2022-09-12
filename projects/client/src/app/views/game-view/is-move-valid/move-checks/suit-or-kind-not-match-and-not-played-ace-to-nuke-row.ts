import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { opponentAceOnTopOfAnyRow } from '../shared-logic/opponent-ace-on-top-of-any-row';

export function suitOrKindNotMatchAndNotPlayedAceToNukeRow(
  gameState: PlayerGameStateModel,
  move: MoveModel
) {
  // TODO: For now, assume each move has one place card attempt
  const { Card, TargetLaneIndex } = move.PlaceCardAttempts[0];
  const { LastCardPlayed } = gameState.Lanes[TargetLaneIndex];

  if (!LastCardPlayed) {
    return false;
  }

  const suitOrKindNotMatch =
    Card.Suit != LastCardPlayed.Suit && Card.Kind != LastCardPlayed.Kind;

  const lane = gameState.Lanes[TargetLaneIndex];

  const playedAceToNukeRow =
    opponentAceOnTopOfAnyRow(lane, gameState.IsHost) &&
    Card.Kind == KindModel.Ace;

  return suitOrKindNotMatch && !playedAceToNukeRow;
}
