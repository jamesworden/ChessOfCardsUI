import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';
import { ResponsiveSizeService } from '../services/responsive-size.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent {
  @Input() laneIndex: number;
  @Input() rowIndex: number;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttemptModel> =
    new EventEmitter();

  constructor(public responsiveSizeService: ResponsiveSizeService) {}

  drop(event: CdkDragDrop<string, { suit: string; kind: string }>) {
    const Card = event.item.data;

    const placeCardAttempt: PlaceCardAttemptModel = {
      Card,
      TargetLaneIndex: this.laneIndex,
      TargetRowIndex: this.rowIndex,
    };

    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
