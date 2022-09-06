import { CardModel } from 'projects/client/src/app/models/card.model';
import { LaneModel } from 'projects/client/src/app/models/lane.model';
import * as _ from 'lodash';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function convertLaneToHostPov(lane: LaneModel) {
  lane.Rows.reverse();

  lane.Rows.forEach((row) => {
    row.forEach((card) => {
      switchHostAndGuestPlayedBy(card);
    });
  });

  if (lane.LastCardPlayed) {
    switchHostAndGuestPlayedBy(lane.LastCardPlayed);
  }

  switchLaneAdvantage(lane);

  return lane;
}

function switchHostAndGuestPlayedBy(card: CardModel) {
  if (card.PlayedBy != PlayerOrNoneModel.None) {
    card.PlayedBy =
      card.PlayedBy === PlayerOrNoneModel.Host
        ? PlayerOrNoneModel.Guest
        : PlayerOrNoneModel.Host;
  }
}

function switchLaneAdvantage(lane: LaneModel) {
  if (lane.LaneAdvantage != PlayerOrNoneModel.None) {
    lane.LaneAdvantage =
      lane.LaneAdvantage == PlayerOrNoneModel.Host
        ? PlayerOrNoneModel.Guest
        : PlayerOrNoneModel.Host;
  }
}
