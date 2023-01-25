import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModel } from '../../../../models/card.model';
import { LaneModel } from '../../../../models/lane.model';
import { PlaceCardAttemptModel } from '../../../../models/place-card-attempt.model';
import { PlayerOrNoneModel } from '../../../../models/player-or-none-model';
import {
  getCardImageFileName as getCardImageFileNameFn,
  getJokerImageFileName as getJokerImageFileNameFn,
} from '../../../../util/get-asset-file-names';

const LIGHT_BLUE_TINT = 'var(--red)';
const LIGHT_RED_TINT = 'var(--blue)';

@Component({
  selector: 'app-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.css'],
})
export class LaneComponent {
  @Input() lane: LaneModel;
  @Input() laneIndex: number;
  @Input() isHost: boolean;
  @Input() redJokerLaneIndex?: number;
  @Input() blackJokerLaneIndex?: number;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttemptModel> =
    new EventEmitter();

  PlayerOrNone = PlayerOrNoneModel;
  getJokerImageFileName = getJokerImageFileNameFn;
  getCardImageFileName = getCardImageFileNameFn;

  constructor() {}

  getLaneBackgroundColor() {
    if (this.lane.WonBy === PlayerOrNoneModel.None) {
      return 'transparent';
    }

    return this.getPlayerWonLane() ? LIGHT_BLUE_TINT : LIGHT_RED_TINT;
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttemptModel) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }

  getTopCard(row: CardModel[]) {
    const lastIndex = row.length - 1;
    return row[lastIndex];
  }

  private getPlayerWonLane() {
    const hostAndHostWonLane =
      this.isHost && this.lane.WonBy === PlayerOrNoneModel.Host;
    const guestAndGuestWonLane =
      !this.isHost && this.lane.WonBy === PlayerOrNoneModel.Guest;

    return hostAndHostWonLane || guestAndGuestWonLane;
  }

  getPositionBackgroundColor(
    laneIndex: number,
    rowIndex: number,
    topCard?: CardModel
  ) {
    if (!topCard) {
      const rowAndLaneIndexSum = laneIndex + rowIndex;
      const defaultBackgroundColor =
        rowAndLaneIndexSum % 2 === 0
          ? 'var(--dark-green)'
          : 'var(--light-green)';

      return defaultBackgroundColor;
    }

    const { LastCardPlayed } = this.lane;

    if (!LastCardPlayed) {
      return 'transparent';
    }

    if (LastCardPlayed.PlayedBy === PlayerOrNoneModel.None) {
      return 'transparent';
    }

    const isLastCardPlayed =
      topCard.Kind === LastCardPlayed.Kind &&
      topCard.Suit === LastCardPlayed.Suit;

    if (!isLastCardPlayed) {
      return 'transparent';
    }

    const hostAndPlayedByHost =
      topCard.PlayedBy === PlayerOrNoneModel.Host && this.isHost;
    const guestAndPlayedByGuest =
      topCard.PlayedBy === PlayerOrNoneModel.Guest && !this.isHost;
    const playerPlayedCard = hostAndPlayedByHost || guestAndPlayedByGuest;

    return playerPlayedCard ? 'var(--blue)' : 'var(--red)';
  }
}
