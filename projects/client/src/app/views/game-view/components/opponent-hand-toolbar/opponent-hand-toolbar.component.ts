import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ResponsiveSizeService } from '@shared/game';

@Component({
  selector: 'app-opponent-hand-toolbar',
  templateUrl: './opponent-hand-toolbar.component.html',
  styleUrl: './opponent-hand-toolbar.component.scss',
})
export class OpponentHandToolbarComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Input() numCardsInOpponentsHand = 0;
  @Input() isPlacingMultipleCards = false;
  @Input() cardSize = 64;
  @Input() hasPendingDrawOffer = false;

  @Output() placeMultipleCardsConfirmed = new EventEmitter<void>();
  @Output() placeMultipleCardsCanceled = new EventEmitter<void>();
  @Output() drawAccepted = new EventEmitter<void>();
  @Output() drawDenied = new EventEmitter<void>();

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  confirmPlaceMultipleCards() {
    this.placeMultipleCardsConfirmed.emit();
  }

  cancelPlaceMultipleCards() {
    this.placeMultipleCardsCanceled.emit();
  }

  acceptDraw() {
    this.drawAccepted.emit();
  }

  denyDraw() {
    this.drawDenied.emit();
  }
}
