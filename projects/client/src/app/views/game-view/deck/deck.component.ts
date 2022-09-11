import { Component, Input, OnChanges } from '@angular/core';

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

  constructor() {}

  ngOnChanges() {
    this.numCardsToDisplay = this.totalNumCards >= 3 ? 3 : this.totalNumCards;
  }
}
