import { Lane } from '../../../models/lane.model';
import { PlayerOrNone } from '../../../models/player-or-none.model';

export function playerHasWonLane(isHost: boolean, lane: Lane) {
  const hostAndHostWonLane = isHost && lane.WonBy === PlayerOrNone.Host;
  const guestAndGuestWonLane = !isHost && lane.WonBy === PlayerOrNone.Guest;
  return hostAndHostWonLane || guestAndGuestWonLane;
}
