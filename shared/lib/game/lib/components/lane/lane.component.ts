import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { getPositionDetails } from './get-position-details';
import { PlayerOrNone, Lane, PlaceCardAttempt } from '@shared/models';
import { fadeInOutAnimation } from '@shared/animations';

@Component({
  selector: 'game-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.scss'],
  animations: [fadeInOutAnimation],
})
export class LaneComponent {
  readonly PlayerOrNone = PlayerOrNone;

  @Input({ required: true }) laneIndex: number;
  @Input({ required: true }) isHost: boolean;
  @Input() redJokerLaneIndex?: number;
  @Input() blackJokerLaneIndex?: number;
  @Input() transparentTiles = false;
  @Input() set isPlayersTurn(isPlayersTurn: boolean) {
    this.isPlayersTurn$.next(isPlayersTurn);
  }
  @Input({ required: true }) set lane(lane: Lane) {
    this.lane$.next(lane);
  }

  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  readonly lane$ = new BehaviorSubject<Lane | null>(null);
  readonly isPlayersTurn$ = new BehaviorSubject(false);

  positions$ = combineLatest([this.lane$, this.isPlayersTurn$]).pipe(
    map(([lane, isPlayersTurn]) =>
      lane
        ? lane?.Rows.map((row, rowIndex) =>
            getPositionDetails(
              lane,
              row,
              this.isHost,
              isPlayersTurn,
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
