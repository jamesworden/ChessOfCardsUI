import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-opponent-hand-toolbar',
  templateUrl: './opponent-hand-toolbar.component.html',
  styleUrl: './opponent-hand-toolbar.component.scss',
})
export class OpponentHandToolbarComponent {
  readonly #matSnackBar = inject(MatSnackBar);

  @Input() numCardsInOpponentsHand = 0;
  @Input() isPlacingMultipleCards = false;
  @Input() cardSize = 64;
  @Input() hasPendingDrawOffer = false;

  @Output() placeMultipleCardsConfirmed = new EventEmitter<void>();
  @Output() placeMultipleCardsCanceled = new EventEmitter<void>();
  @Output() drawAccepted = new EventEmitter<void>();
  @Output() drawDenied = new EventEmitter<void>();

  confirmPlaceMultipleCards() {
    this.#matSnackBar.dismiss();
    this.placeMultipleCardsConfirmed.emit();
  }

  cancelPlaceMultipleCards() {
    this.#matSnackBar.dismiss();
    this.placeMultipleCardsCanceled.emit();
  }

  acceptDraw() {
    this.drawAccepted.emit();
  }

  denyDraw() {
    this.drawDenied.emit();
  }

  showPlaceMultipleInfoMessage() {
    this.#matSnackBar.open(
      'You can place multiple cards of the same kind.',
      'Hide',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }
}
