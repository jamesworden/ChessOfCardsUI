import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { Z_INDEXES } from '../../z-indexes';
import { DEFAULT_CARD_SIZE } from '../../constants';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly Z_INDEXES = Z_INDEXES;
  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly defaultCardSize = DEFAULT_CARD_SIZE;

  @Input() playerGameView: PlayerGameView;
  @Input() initialPlaceMultipleCardAttempt: PlaceCardAttempt | null;
  @Input() isPlacingMultipleCards: boolean | null;
  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
