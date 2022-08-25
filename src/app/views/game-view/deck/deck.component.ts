import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css'],
})
export class DeckComponent implements OnInit {
  @Input() isOpponent!: boolean;
  @Input() totalNumCards!: number;

  numCardsToDisplay = this.totalNumCards >= 3 ? 3 : this.totalNumCards;

  constructor() {
    console.log(this.numCardsToDisplay);
  }

  ngOnInit(): void {}
}
