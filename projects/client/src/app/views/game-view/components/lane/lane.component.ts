import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from '../../../../models/card.model';
import { Lane } from '../../../../models/lane.model';
import { PlaceCardAttempt } from '../../../../models/place-card-attempt.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
import { getDefaultCardBackgroundColor } from '../../logic/get-default-card-background-color';
import { playerHasWonLane } from '../../logic/player-has-won-lane';
import { LIGHT_BLUE_TINT, LIGHT_RED_TINT, TRANSPARENT } from '../../constants';
import { getLastCardPlayedBackgroundColor } from '../../logic/get-last-card-played-background-color';

interface PositionDetails {
  topCard?: Card;
  rowIndex: number;
  backgroundColor: string;
}

@Component({
  selector: 'app-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.css'],
})
export class LaneComponent implements OnInit {
  @Input() lane: Lane;
  @Input() laneIndex: number;
  @Input() isHost: boolean;
  @Input() redJokerLaneIndex?: number;
  @Input() blackJokerLaneIndex?: number;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  PlayerOrNone = PlayerOrNone;
  positions: PositionDetails[] = [];

  constructor() {}

  ngOnInit() {
    this.initPositions();
  }

  private initPositions() {
    const positions: PositionDetails[] = [];

    for (let rowIndex = 0; rowIndex < this.lane.Rows.length; rowIndex++) {
      const row = this.lane.Rows[rowIndex];
      const topCard = row[row.length - 1];
      const backgroundColor =
        this.lane.WonBy === PlayerOrNone.None
          ? this.getPositionBackgroundColor(rowIndex, topCard)
          : this.getLaneBackgroundColor();

      const position: PositionDetails = {
        rowIndex,
        backgroundColor,
        topCard,
      };

      positions.push(position);

      this.positions = positions;
    }
  }

  private getLaneBackgroundColor() {
    return playerHasWonLane(this.isHost, this.lane)
      ? LIGHT_BLUE_TINT
      : LIGHT_RED_TINT;
  }

  private getPositionBackgroundColor(rowIndex: number, topCard?: Card) {
    const { LastCardPlayed } = this.lane;

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
