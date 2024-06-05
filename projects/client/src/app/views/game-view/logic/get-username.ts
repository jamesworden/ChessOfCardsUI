import { PlayerGameView } from '@shared/models';

export function getPlayerUsername(playerGameView: PlayerGameView | null) {
  if (playerGameView) {
    return playerGameView.IsHost
      ? playerGameView.HostName ?? 'Host Player'
      : playerGameView.GuestName ?? 'Guest Player';
  } else {
    return 'You';
  }
}

export function getOpponentUsername(playerGameView: PlayerGameView | null) {
  if (playerGameView) {
    return playerGameView.IsHost
      ? playerGameView.GuestName ?? 'Guest Player'
      : playerGameView.HostName ?? 'Host Player';
  } else {
    return 'Opponent';
  }
}
