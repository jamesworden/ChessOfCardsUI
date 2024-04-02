import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lane } from '../../../../models/lane.model';
import { PlaceCardAttempt } from '../../../../models/place-card-attempt.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { getPositionDetails } from './get-position-details';

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
  @Input() isPlayersTurn = false;

  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  readonly lane$ = new BehaviorSubject<Lane | null>(null);

  positions$ = this.lane$.pipe(
    map((lane) =>
      lane
        ? lane?.Rows.map((row, rowIndex) =>
            getPositionDetails(
              lane,
              row,
              this.isHost,
              this.isPlayersTurn,
              rowIndex,
              this.laneIndex
            )
          )
        : []
    )
  );

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
