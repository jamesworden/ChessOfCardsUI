import { PlayerGameView } from '@shared/models';

export function getPlayerUsername(playerGameView: PlayerGameView | null) {
  if (playerGameView) {
    return playerGameView.isHost
      ? playerGameView.hostName ?? 'Host Player'
      : playerGameView.guestName ?? 'Guest Player';
  } else {
    return 'You';
  }
}

export function getOpponentUsername(playerGameView: PlayerGameView | null) {
  if (playerGameView) {
    return playerGameView.isHost
      ? playerGameView.guestName ?? 'Guest Player'
      : playerGameView.hostName ?? 'Host Player';
  } else {
    return 'Opponent';
  }
}
