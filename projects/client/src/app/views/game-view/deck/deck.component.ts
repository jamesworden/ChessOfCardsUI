import { Component, Input, OnChanges } from '@angular/core';
import { ResponsiveSizeService } from '../responsive-size.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css'],
})
export class DeckComponent implements OnChanges {
  @Input() isOpponent: boolean;
  @Input() totalNumCards: number;
  @Input() rightSide: boolean;

  numCardsToDisplay = 0;

  constructor(public responsiveSizeService: ResponsiveSizeService) {}

  ngOnChanges() {
    this.numCardsToDisplay = this.totalNumCards >= 3 ? 3 : this.totalNumCards;
  }
}
