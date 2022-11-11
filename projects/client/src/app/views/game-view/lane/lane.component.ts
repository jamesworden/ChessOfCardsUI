import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModel } from '../../../models/card.model';
import { LaneModel } from '../../../models/lane.model';
import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';
import { PlayerOrNoneModel } from '../../../models/player-or-none-model';
import {
  getCardImageFileName as getCardImageFileNameFn,
  getJokerImageFileName as getJokerImageFileNameFn,
} from '../../../util/get-asset-file-names';

const LIGHT_BLUE_TINT = 'rgba(0, 0, 255, 0.2)';
const LIGHT_RED_TINT = 'rgba(255, 0, 0, 0.2)';

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

    const hostAndHostWonLane =
      this.isHost && this.lane.WonBy === PlayerOrNoneModel.Host;
    const guestAndGuestWonLane =
      !this.isHost && this.lane.WonBy === PlayerOrNoneModel.Guest;
    const playerWonLane = hostAndHostWonLane || guestAndGuestWonLane;

    return playerWonLane ? LIGHT_BLUE_TINT : LIGHT_RED_TINT;
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttemptModel) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }

  getCardBackgroundColor(card: CardModel) {
    const { LastCardPlayed } = this.lane;

    if (!LastCardPlayed) {
      return null;
    }

    if (LastCardPlayed.PlayedBy === PlayerOrNoneModel.None) {
      return null;
    }

    const isLastCardPlayed =
      card.Kind === LastCardPlayed.Kind && card.Suit === LastCardPlayed.Suit;

    if (!isLastCardPlayed) {
      return 'transparent';
    }

    const hostAndHostPlayedCard =
      this.isHost && LastCardPlayed.PlayedBy === PlayerOrNoneModel.Host;
    const guestAndGuestPlayedCard =
      this.isHost && LastCardPlayed.PlayedBy === PlayerOrNoneModel.Guest;
    const playerPlayedCard = hostAndHostPlayedCard || guestAndGuestPlayedCard;

    return playerPlayedCard ? LIGHT_BLUE_TINT : LIGHT_RED_TINT;
  }

  getTopCard(row: CardModel[]) {
    const lastIndex = row.length - 1;
    return row[lastIndex];
  }
}
