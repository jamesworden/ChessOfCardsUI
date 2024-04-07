import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ResponsiveSizeService } from '@shared/game';
import { BehaviorSubject } from 'rxjs';
import { PlaceCardAttempt, PlayerGameView } from '@shared/models';
import { DEFAULT_CARD_SIZE } from 'projects/client/src/app/views/game-view/constants';
import { Z_INDEXES } from '@shared/constants';

@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly Z_INDEXES = Z_INDEXES;
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

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  readonly playerGameView$ = new BehaviorSubject<PlayerGameView | null>(null);

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }
}
