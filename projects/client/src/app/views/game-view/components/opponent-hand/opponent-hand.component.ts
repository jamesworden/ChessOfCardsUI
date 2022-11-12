import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-opponent-hand',
  templateUrl: './opponent-hand.component.html',
  styleUrls: ['./opponent-hand.component.css'],
})
export class OpponentHandComponent {
  @Input() numCards: number;
  @Input() cardSize: number;

  constructor() {}
}
