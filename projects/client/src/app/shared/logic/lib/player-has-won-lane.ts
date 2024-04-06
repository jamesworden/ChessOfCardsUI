import { PlayerOrNone, Lane } from '@client/models';

export function playerHasWonLane(isHost: boolean, lane: Lane) {
  const hostAndHostWonLane = isHost && lane.WonBy === PlayerOrNone.Host;
  const guestAndGuestWonLane = !isHost && lane.WonBy === PlayerOrNone.Guest;
  return hostAndHostWonLane || guestAndGuestWonLane;
}
