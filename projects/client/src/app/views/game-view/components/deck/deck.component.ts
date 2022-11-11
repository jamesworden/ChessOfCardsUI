import { Component, Input, OnChanges } from '@angular/core';
import { SubscriptionManager } from '../../../../util/subscription-manager';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css'],
})
export class DeckComponent implements OnChanges {
  @Input() isOpponent: boolean;
  @Input() totalNumCards: number;
  @Input() rightSide: boolean;

  private sm = new SubscriptionManager();

  numCardsToDisplay = 0;
  cardSize = 64;

  constructor(public responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnChanges() {
    this.numCardsToDisplay = this.totalNumCards >= 3 ? 3 : this.totalNumCards;
  }

  getCardCountFontSize() {
    const pixels = Math.min(this.cardSize / 4, 22);
    return pixels + 'px';
  }

  getCardCountTop() {
    const pixels = this.cardSize + 4;
    return pixels + 'px';
  }

  getCardRight(cardIndex: number) {
    let pixels = 0;

    if (this.rightSide) {
      const slightCardShift = cardIndex * 6;
      const halfCardShift = this.cardSize / 2;
      const boardAndDeckPadding = this.cardSize / 6;
      const totalShift = slightCardShift + halfCardShift + boardAndDeckPadding;

      pixels = -totalShift;
    } else {
      const cardShift = cardIndex * 6;

      pixels = cardShift;
    }

    return pixels + 'px';
  }

  getCardHeight() {
    const pixels = this.cardSize;
    return pixels + 'px';
  }
}
