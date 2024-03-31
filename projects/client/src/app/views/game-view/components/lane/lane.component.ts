import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../../../models/card.model';
import { Lane } from '../../../../models/lane.model';
import { PlaceCardAttempt } from '../../../../models/place-card-attempt.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
import { getDefaultCardBackgroundColor } from '../../logic/get-default-card-background-color';
import { playerHasWonLane } from '../../logic/player-has-won-lane';
import { LIGHT_BLUE_TINT, LIGHT_RED_TINT } from '../../constants';
import { getLastCardPlayedBackgroundColor } from '../../logic/get-last-card-played-background-color';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { getCardTiltDegrees } from '../../logic/get-card-tilt-degrees';

interface PositionDetails {
  topCard?: Card;
  rowIndex: number;
  backgroundColor: string;
  cardRotation: number;
}

@Component({
  selector: 'app-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.scss'],
})
export class LaneComponent {
  readonly PlayerOrNone = PlayerOrNone;

  @Input() set lane(lane: Lane) {
    this.lane$.next(lane);
  }
  @Input() laneIndex: number;
  @Input() isHost: boolean;
  @Input() redJokerLaneIndex?: number;
  @Input() blackJokerLaneIndex?: number;
  @Input() transparentTiles = false;

  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  readonly lane$ = new BehaviorSubject<Lane | null>(null);

  positions$ = this.lane$.pipe(
    map((lane) =>
      lane
        ? lane?.Rows.map((row, i) => {
            const topCard = row[row.length - 1];

            const backgroundColor =
              lane.WonBy === PlayerOrNone.None
                ? this.getPositionBackgroundColor(lane, i, topCard)
                : this.getLaneBackgroundColor(lane);

            const cardRotation = topCard
              ? getCardTiltDegrees(topCard, i, this.isHost, lane.LaneAdvantage)
              : 0;

            const position: PositionDetails = {
              rowIndex: i,
              backgroundColor,
              topCard,
              cardRotation,
            };

            return position;
          })
        : []
    )
  );

  private getLaneBackgroundColor(lane: Lane) {
    return playerHasWonLane(this.isHost, lane)
      ? LIGHT_BLUE_TINT
      : LIGHT_RED_TINT;
  }

  private getPositionBackgroundColor(
    lane: Lane,
    rowIndex: number,
    topCard?: Card
  ) {
    const { LastCardPlayed } = lane;

    const isLastCardPlayed =
      topCard &&
      LastCardPlayed &&
      LastCardPlayed.PlayedBy !== PlayerOrNone.None &&
      topCard.Kind === LastCardPlayed.Kind &&
      topCard.Suit === LastCardPlayed.Suit;

    return isLastCardPlayed
      ? getLastCardPlayedBackgroundColor(topCard!, this.isHost)
      : getDefaultCardBackgroundColor(this.laneIndex, rowIndex);
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
