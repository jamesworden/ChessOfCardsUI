import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModel } from '../../../../models/card.model';
import { LaneModel } from '../../../../models/lane.model';
import { PlaceCardAttemptModel } from '../../../../models/place-card-attempt.model';
import { PlayerOrNoneModel } from '../../../../models/player-or-none-model';
import {
  getCardImageFileName as getCardImageFileNameFn,
  getJokerImageFileName as getJokerImageFileNameFn,
} from '../../../../util/get-asset-file-names';
import { getDefaultCardBackgroundColor } from '../../logic/get-default-card-background-color';

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
    const { LastCardPlayed } = this.lane;

    const isLastCardPlayed =
      topCard &&
      LastCardPlayed &&
      LastCardPlayed.PlayedBy !== PlayerOrNoneModel.None &&
      topCard.Kind === LastCardPlayed.Kind &&
      topCard.Suit === LastCardPlayed.Suit;

    return isLastCardPlayed
      ? this.getLastCardPlayedBackgroundColor(topCard!)
      : getDefaultCardBackgroundColor(laneIndex, rowIndex);
  }

  getLastCardPlayedBackgroundColor(lastCardPlayed: CardModel) {
    const hostAndPlayedByHost =
      lastCardPlayed.PlayedBy === PlayerOrNoneModel.Host && this.isHost;
    const guestAndPlayedByGuest =
      lastCardPlayed.PlayedBy === PlayerOrNoneModel.Guest && !this.isHost;
    const playerPlayedCard = hostAndPlayedByHost || guestAndPlayedByGuest;

    return playerPlayedCard ? 'var(--blue)' : 'var(--red)';
  }
}
