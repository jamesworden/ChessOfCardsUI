import { PlayerGameView } from '@shared/models';

export function notPlayersTurn(gameState: PlayerGameView) {
  const hostAndHostTurn = gameState.IsHost && gameState.IsHostPlayersTurn;
  const guestAndGuestTurn = !gameState.IsHost && !gameState.IsHostPlayersTurn;

  return !hostAndHostTurn && !guestAndGuestTurn;
}
