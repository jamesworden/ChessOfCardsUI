import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gutter',
  templateUrl: './gutter.component.html',
  styleUrls: ['./gutter.component.css'],
})
export class GutterComponent {
  @Input() cardSize: number;
  @Input() numCardsInOpponentsDeck: number;
  @Input() isHost: boolean;
  @Input() numCardsInPlayersDeck: number;

  constructor() {}
}
