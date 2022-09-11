import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';

export function notPlayersTurn(gameState: PlayerGameStateModel) {
  const hostAndHostTurn = gameState.IsHost && gameState.IsHostPlayersTurn;
  const guestAndGuestTurn = !gameState.IsHost && !gameState.IsHostPlayersTurn;

  return !hostAndHostTurn && !guestAndGuestTurn;
}
