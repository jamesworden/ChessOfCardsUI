import { PlayerOrNone, Lane } from '@shared/models';

export function playerHasWonLane(isHost: boolean, lane: Lane) {
  const hostAndHostWonLane = isHost && lane.wonBy === PlayerOrNone.Host;
  const guestAndGuestWonLane = !isHost && lane.wonBy === PlayerOrNone.Guest;
  return hostAndHostWonLane || guestAndGuestWonLane;
}
