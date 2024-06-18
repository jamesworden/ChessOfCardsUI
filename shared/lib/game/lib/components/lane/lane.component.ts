import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PositionDetails, getPositionDetails } from './get-position-details';
import {
  PlayerOrNone,
  Lane,
  PlaceCardAttempt,
  Card,
  CardPosition,
} from '@shared/models';
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
  @Input() validMoveRowIndexes: Set<number> | null = null;
  @Input() selectedCard: Card | null = null;
  @Input() set selectedPosition(selectedPosition: CardPosition | null) {
    this.selectedPosition$.next(selectedPosition);
  }
  @Input() set isPlayersTurn(isPlayersTurn: boolean) {
    this.isPlayersTurn$.next(isPlayersTurn);
  }
  @Input({ required: true }) set lane(lane: Lane) {
    this.lane$.next(lane);
  }

  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();
  @Output() rowIndexClicked: EventEmitter<number> = new EventEmitter();

  readonly lane$ = new BehaviorSubject<Lane | null>(null);
  readonly isPlayersTurn$ = new BehaviorSubject(false);
  readonly selectedPosition$ = new BehaviorSubject<CardPosition | null>(null);

  readonly positions$ = combineLatest([
    this.lane$,
    this.isPlayersTurn$,
    this.selectedPosition$,
  ]).pipe(
    map(([lane, isPlayersTurn, selectedPosition]) =>
      lane
        ? lane?.rows.map((row, rowIndex) =>
            getPositionDetails(
              lane,
              row,
              this.isHost,
              isPlayersTurn,
              rowIndex,
              this.laneIndex,
              selectedPosition
            )
          )
        : []
    )
  );

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }

  onPositionClicked(position: PositionDetails) {
    this.rowIndexClicked.emit(position.rowIndex);
  }
}
