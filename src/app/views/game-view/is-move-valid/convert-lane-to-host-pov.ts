import { CardModel } from 'src/app/models/card.model';
import { LaneModel } from 'src/app/models/lane.model';
import { PlayedByModel } from 'src/app/models/played-by.model';
import * as _ from 'lodash';

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

  return lane;
}

function switchHostAndGuestPlayedBy(card: CardModel) {
  card.PlayedBy =
    card.PlayedBy === PlayedByModel.Host
      ? PlayedByModel.Guest
      : PlayedByModel.Host;
}
