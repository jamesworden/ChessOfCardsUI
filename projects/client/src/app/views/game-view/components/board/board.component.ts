import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { Z_INDEXES } from '../../z-indexes';
import { DEFAULT_CARD_SIZE } from '../../constants';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly Z_INDEXES = Z_INDEXES;
  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly defaultCardSize = DEFAULT_CARD_SIZE;

  @Input({ required: true }) set playerGameView(
    playerGameView: PlayerGameView
  ) {
    // Hacky change detection to update lanes
    playerGameView.Lanes = [...playerGameView.Lanes];
    const x = JSON.stringify(playerGameView);
    const y = JSON.parse(x) as PlayerGameView;
    this.playerGameView$.next(y);
  }
  @Input() initialPlaceMultipleCardAttempt: PlaceCardAttempt | null;
  @Input() isPlacingMultipleCards: boolean | null;
  @Input() transparentTiles = false;
  @Input({ required: true }) isPlayersTurn = false;

  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();

  readonly playerGameView$ = new BehaviorSubject<PlayerGameView | null>(null);

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
