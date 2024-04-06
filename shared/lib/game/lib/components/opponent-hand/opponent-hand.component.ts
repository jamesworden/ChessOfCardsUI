import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-opponent-hand',
  templateUrl: './opponent-hand.component.html',
  styleUrls: ['./opponent-hand.component.scss'],
})
export class OpponentHandComponent {
  @Input({ required: true }) numCards: number;
  @Input({ required: true }) cardSize: number;
}
