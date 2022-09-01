import { PlayerGameStateModel } from 'src/app/models/player-game-state-model';

export function isPlayersTurn(gameState: PlayerGameStateModel) {
  const { IsHostPlayersTurn, IsHost } = gameState;
  const isPlayersTurn =
    (IsHostPlayersTurn && IsHost) || (!IsHostPlayersTurn && !IsHost);

  return isPlayersTurn;
}
