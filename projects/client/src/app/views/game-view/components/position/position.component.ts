import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, inject, Output } from '@angular/core';
import { PlaceCardAttempt } from '../../../../models/place-card-attempt.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  guestLaneIndexesToRowIndexMarkers,
  hostLaneIndexesToRowIndexMarkers,
} from './lane-indexes-to-row-index-markers';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Input({ required: true }) set laneIndex(laneIndex: number) {
    this.laneIndex$.next(laneIndex);
  }
  @Input({ required: true }) set rowIndex(rowIndex: number) {
    this.rowIndex$.next(rowIndex);
  }
  @Input({ required: true }) backgroundColor: string;
  @Input({ required: true }) textColor: string;
  @Input() transparentTile = false;
  @Input({ required: true }) set isHost(isHost: boolean) {
    this.isHost$.next(isHost);
  }

  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  readonly isHost$ = new BehaviorSubject(false);
  readonly laneIndex$ = new BehaviorSubject(0);
  readonly rowIndex$ = new BehaviorSubject(0);

  readonly marker$ = combineLatest([
    this.isHost$,
    this.laneIndex$,
    this.rowIndex$,
  ]).pipe(
    map(([isHost, laneIndex, rowIndex]) => {
      const markers = isHost
        ? hostLaneIndexesToRowIndexMarkers
        : guestLaneIndexesToRowIndexMarkers;
      return markers[laneIndex]?.[rowIndex];
    })
  );

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  drop(event: CdkDragDrop<string, { suit: string; kind: string }>) {
    const Card = event.item.data;

    const placeCardAttempt: PlaceCardAttempt = {
      Card,
      TargetLaneIndex: this.laneIndex$.getValue(),
      TargetRowIndex: this.rowIndex$.getValue(),
    };

    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
