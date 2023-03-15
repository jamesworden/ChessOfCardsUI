import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../../../models/card.model';
import { Lane } from '../../../../models/lane.model';
import { PlaceCardAttempt } from '../../../../models/place-card-attempt.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
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
  @Input() lane: Lane;
  @Input() laneIndex: number;
  @Input() isHost: boolean;
  @Input() redJokerLaneIndex?: number;
  @Input() blackJokerLaneIndex?: number;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  PlayerOrNone = PlayerOrNone;
  getJokerImageFileName = getJokerImageFileNameFn;
  getCardImageFileName = getCardImageFileNameFn;

  constructor() {}

  getLaneBackgroundColor() {
    if (this.lane.WonBy === PlayerOrNone.None) {
      return 'transparent';
    }

    return this.getPlayerWonLane() ? LIGHT_BLUE_TINT : LIGHT_RED_TINT;
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }

  getTopCard(row: Card[]) {
    const lastIndex = row.length - 1;
    return row[lastIndex];
  }

  private getPlayerWonLane() {
    const hostAndHostWonLane =
      this.isHost && this.lane.WonBy === PlayerOrNone.Host;
    const guestAndGuestWonLane =
      !this.isHost && this.lane.WonBy === PlayerOrNone.Guest;

    return hostAndHostWonLane || guestAndGuestWonLane;
  }

  getPositionBackgroundColor(
    laneIndex: number,
    rowIndex: number,
    topCard?: Card
  ) {
    const laneBackgroundColor = this.getLaneBackgroundColor();

    if (laneBackgroundColor !== 'transparent') {
      return laneBackgroundColor;
    }

    const { LastCardPlayed } = this.lane;

    const isLastCardPlayed =
      topCard &&
      LastCardPlayed &&
      LastCardPlayed.PlayedBy !== PlayerOrNone.None &&
      topCard.Kind === LastCardPlayed.Kind &&
      topCard.Suit === LastCardPlayed.Suit;

    return isLastCardPlayed
      ? this.getLastCardPlayedBackgroundColor(topCard!)
      : getDefaultCardBackgroundColor(laneIndex, rowIndex);
  }

  getLastCardPlayedBackgroundColor(lastCardPlayed: Card) {
    const hostAndPlayedByHost =
      lastCardPlayed.PlayedBy === PlayerOrNone.Host && this.isHost;
    const guestAndPlayedByGuest =
      lastCardPlayed.PlayedBy === PlayerOrNone.Guest && !this.isHost;
    const playerPlayedCard = hostAndPlayedByHost || guestAndPlayedByGuest;

    return playerPlayedCard ? 'var(--blue)' : 'var(--red)';
  }
}
