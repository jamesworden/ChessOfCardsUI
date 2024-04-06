import { PlayerOrNone, Card } from '@shared/models';

export function getCardTiltDegrees(
  card: Card,
  rowIndex: number,
  isHost: boolean,
  laneAdvantage: PlayerOrNone
) {
  const isMiddleCard = rowIndex === 3;
  if (!isMiddleCard) {
    return 0;
  }

  // Card animations where the lane hasn't technically been won yet use its PlayedBy
  // property to determine which way it should turn because we know it's going to the middle.
  if (laneAdvantage === PlayerOrNone.None) {
    laneAdvantage = card.PlayedBy;
  }

  const nobodyHasAdvantage = laneAdvantage === PlayerOrNone.None;
  if (nobodyHasAdvantage) {
    return 0;
  }

  const hostAdvAndIsHost = isHost && laneAdvantage === PlayerOrNone.Host;
  const guestAdvAndIsGuest = !isHost && laneAdvantage === PlayerOrNone.Guest;
  const playerPlayedCard = hostAdvAndIsHost || guestAdvAndIsGuest;

  return playerPlayedCard ? 45 : -45;
}
