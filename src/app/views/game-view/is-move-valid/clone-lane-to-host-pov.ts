import { CardModel } from 'src/app/models/card.model';
import { LaneModel } from 'src/app/models/lane.model';
import { PlayedByModel } from 'src/app/models/played-by.model';
import * as _ from 'lodash';

export function cloneLaneToHostPov(lane: LaneModel) {
  const clonedLane = _.cloneDeep(lane);
  clonedLane.Rows.reverse();

  clonedLane.Rows.forEach((row) => {
    row.forEach((card) => {
      switchHostAndGuestPlayedBy(card);
    });
  });

  if (clonedLane.LastCardPlayed) {
    switchHostAndGuestPlayedBy(clonedLane.LastCardPlayed);
  }

  return clonedLane;
}

function switchHostAndGuestPlayedBy(card: CardModel) {
  const playedByHost = card.PlayedBy === PlayedByModel.Host;
  const playedByGuest = card.PlayedBy === PlayedByModel.Guest;

  if (playedByHost) {
    card.PlayedBy = PlayedByModel.Guest;
  } else if (playedByGuest) {
    card.PlayedBy = PlayedByModel.Host;
  }
}
