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
  textColor: string;
}

@Component({
  selector: 'app-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.scss'],
})
export class LaneComponent {
  readonly PlayerOrNone = PlayerOrNone;

  @Input({ required: true }) set lane(lane: Lane) {
    this.lane$.next(lane);
  }
  @Input({ required: true }) laneIndex: number;
  @Input({ required: true }) isHost: boolean;
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

            const { positionColor, reversePositionColor } =
              this.getPositionBackgroundColor(lane, i, topCard);
            const { laneColor } = this.getLaneBackgroundColor(lane);
            const reverseLaneColor = 'var(--light-green)';
            const backgroundColor =
              lane.WonBy === PlayerOrNone.None ? positionColor : laneColor;
            const textColor =
              lane.WonBy === PlayerOrNone.None
                ? reversePositionColor
                : reverseLaneColor;

            const cardRotation = topCard
              ? getCardTiltDegrees(topCard, i, this.isHost, lane.LaneAdvantage)
              : 0;

            const position: PositionDetails = {
              rowIndex: i,
              backgroundColor,
              topCard,
              cardRotation,
              textColor,
            };

            return position;
          })
        : []
    )
  );

  private getLaneBackgroundColor(lane: Lane) {
    const laneColor = playerHasWonLane(this.isHost, lane)
      ? LIGHT_BLUE_TINT
      : LIGHT_RED_TINT;

    const reverseLaneColor = playerHasWonLane(this.isHost, lane)
      ? LIGHT_RED_TINT
      : LIGHT_BLUE_TINT;

    return {
      laneColor,
      reverseLaneColor,
    };
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

    const positionColor = isLastCardPlayed
      ? getLastCardPlayedBackgroundColor(topCard!, this.isHost)
      : getDefaultCardBackgroundColor(this.laneIndex, rowIndex);

    const reversePositionColor = getDefaultCardBackgroundColor(
      this.laneIndex,
      rowIndex + 1
    );

    return {
      positionColor,
      reversePositionColor,
    };
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
