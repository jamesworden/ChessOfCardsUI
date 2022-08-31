import { MoveModel } from 'src/app/models/move.model';
import { PlayerGameStateModel } from 'src/app/models/player-game-state-model';

export function isPlayersTurn(_: MoveModel, gameState: PlayerGameStateModel) {
  const { IsHostPlayersTurn, IsHost } = gameState;
  const isPlayersTurn =
    (IsHostPlayersTurn && IsHost) || (!IsHostPlayersTurn && !IsHost);

  return isPlayersTurn;
}
