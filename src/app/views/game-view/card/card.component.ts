import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() cardImageFileName: string;
  @Input() playerCanDrag = false;
  @Input() suit: string;
  @Input() kind: string;

  constructor() {}
}
