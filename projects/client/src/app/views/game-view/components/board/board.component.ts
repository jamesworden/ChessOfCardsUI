import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LaneModel } from 'projects/client/src/app/models/lane.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlaceCardAttemptModel } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { getReasonIfMoveInvalid } from '../../logic/is-move-valid';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { Z_INDEXES } from '../../z-indexes';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  private sm = new SubscriptionManager();

  @Input() playerGameState: PlayerGameStateModel;
  @Input() initialPlaceMultipleCardAttempt: PlaceCardAttemptModel | null;
  @Input() isPlacingMultipleCards: boolean | null;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttemptModel> =
    new EventEmitter();

  Z_INDEXES = Z_INDEXES;
  cardSize: number = 64;

  constructor(private responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      this.responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttemptModel) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
