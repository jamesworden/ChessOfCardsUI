import { Card } from '../../../models/card.model';
import { PlayerOrNone } from '../../../models/player-or-none.model';
import { LIGHT_BLUE_TINT, LIGHT_RED_TINT } from '../constants';

export function getLastCardPlayedBackgroundColor(
  lastCardPlayed: Card,
  isHost: boolean
) {
  const hostAndPlayedByHost =
    lastCardPlayed.PlayedBy === PlayerOrNone.Host && isHost;
  const guestAndPlayedByGuest =
    lastCardPlayed.PlayedBy === PlayerOrNone.Guest && !isHost;
  const playerPlayedCard = hostAndPlayedByHost || guestAndPlayedByGuest;

  return playerPlayedCard ? LIGHT_BLUE_TINT : LIGHT_RED_TINT;
}
