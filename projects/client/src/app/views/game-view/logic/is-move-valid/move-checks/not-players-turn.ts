import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';

export function notPlayersTurn(gameState: PlayerGameView) {
  const hostAndHostTurn = gameState.IsHost && gameState.IsHostPlayersTurn;
  const guestAndGuestTurn = !gameState.IsHost && !gameState.IsHostPlayersTurn;

  return !hostAndHostTurn && !guestAndGuestTurn;
}
