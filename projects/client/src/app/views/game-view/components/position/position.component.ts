import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { PlaceCardAttempt } from '../../../../models/place-card-attempt.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Input() laneIndex: number;
  @Input() rowIndex: number;
  @Input() backgroundColor: string;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  cardSize: number;

  constructor(public responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  drop(event: CdkDragDrop<string, { suit: string; kind: string }>) {
    const Card = event.item.data;

    const placeCardAttempt: PlaceCardAttempt = {
      Card,
      TargetLaneIndex: this.laneIndex,
      TargetRowIndex: this.rowIndex,
    };

    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
