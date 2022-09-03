import { CardModel } from 'src/app/models/card.model';
import { LaneModel } from 'src/app/models/lane.model';
import { PlayedByModel } from 'src/app/models/played-by.model';
import * as _ from 'lodash';
import { LaneAdvantageModel } from 'src/app/models/lane-advantage.model';

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
  card.PlayedBy =
    card.PlayedBy === PlayedByModel.Host
      ? PlayedByModel.Guest
      : PlayedByModel.Host;
}

function switchLaneAdvantage(lane: LaneModel) {
  if (lane.LaneAdvantage != LaneAdvantageModel.None) {
    lane.LaneAdvantage =
      lane.LaneAdvantage == LaneAdvantageModel.Host
        ? LaneAdvantageModel.Guest
        : LaneAdvantageModel.Host;
  }
}
