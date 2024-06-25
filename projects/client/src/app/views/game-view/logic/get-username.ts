import { PlayerGameView } from '@shared/models';

export function getPlayerUsername(playerGameView: PlayerGameView | null) {
  if (playerGameView) {
    return playerGameView.isHost
      ? (playerGameView.hostName?.trim()?.length ?? 0) > 0
        ? playerGameView.hostName
        : 'Host Player'
      : (playerGameView.guestName?.trim()?.length ?? 0) > 0
        ? playerGameView.guestName
        : 'Guest Player';
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
