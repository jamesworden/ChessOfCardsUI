import { KindModel } from 'src/app/models/kind.model';
import { LaneModel } from 'src/app/models/lane.model';
import { PlayerOrNoneModel } from 'src/app/models/player-or-none-model';

export function guestAceTopOfAnyRow(lane: LaneModel) {
  for (const row of lane.Rows) {
    const topCardIndex = row.length - 1;
    const topCard = row[topCardIndex];

    if (!topCard) {
      continue;
    }

    const topCardIsAce = topCard.Kind === KindModel.Ace;
    const topCardPlayedByGuest = topCard.PlayedBy === PlayerOrNoneModel.Guest;

    if (topCardIsAce && topCardPlayedByGuest) {
      return true;
    }
  }

  return false;
}
