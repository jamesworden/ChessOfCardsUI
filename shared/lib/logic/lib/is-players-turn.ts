import { PlayerGameView } from '@shared/models';

export function isPlayersTurn(playerGameView: PlayerGameView) {
  return playerGameView.isHost && playerGameView.isHostPlayersTurn;
}
