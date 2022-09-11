import { KindModel } from 'projects/client/src/app/models/kind.model';
import { LaneModel } from 'projects/client/src/app/models/lane.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function opponentAceOnTopOfAnyRow(
  lane: LaneModel,
  playerIsHost: boolean
) {
  for (const row of lane.Rows) {
    if (row.length <= 0) {
      continue;
    }

    const topCard = row[row.length - 1];
    const topCardIsAce = topCard.Kind == KindModel.Ace;
    const topCardPlayedByOpponent = playerIsHost
      ? topCard.PlayedBy == PlayerOrNoneModel.Host
      : topCard.PlayedBy == PlayerOrNoneModel.Guest;

    if (topCardIsAce && topCardPlayedByOpponent) {
      return true;
    }
  }

  return false;
}
