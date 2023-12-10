import { Card } from '../../../models/card.model';
import { PlayerOrNone } from '../../../models/player-or-none.model';

export function getCardTiltDegrees(
  card: Card,
  rowIndex: number,
  isHost: boolean
) {
  const nobodyPlayedCard = card.PlayedBy === PlayerOrNone.None;
  const isMiddleCard = rowIndex === 3;

  if (nobodyPlayedCard || !isMiddleCard) {
    return 0;
  }

  const hostCardAndIsHost = isHost && card.PlayedBy === PlayerOrNone.Host;
  const guestCardAndIsGuest = !isHost && card.PlayedBy === PlayerOrNone.Guest;
  const playerPlayedCard = hostCardAndIsHost || guestCardAndIsGuest;

  return playerPlayedCard ? 45 : -45;
}
