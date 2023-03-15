import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { Z_INDEXES } from '../../z-indexes';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  private sm = new SubscriptionManager();

  @Input() playerGameView: PlayerGameView;
  @Input() initialPlaceMultipleCardAttempt: PlaceCardAttempt | null;
  @Input() isPlacingMultipleCards: boolean | null;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
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

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
