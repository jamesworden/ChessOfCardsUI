import { PlayerGameView } from '@client/models';

export function isPlayersTurn(playerGameView: PlayerGameView) {
  const { IsHost, IsHostPlayersTurn } = playerGameView;

  const hostAndHostTurn = IsHost && IsHostPlayersTurn;
  const guestAndGuestTurn = !IsHost && !IsHostPlayersTurn;
  return hostAndHostTurn || guestAndGuestTurn;
}
