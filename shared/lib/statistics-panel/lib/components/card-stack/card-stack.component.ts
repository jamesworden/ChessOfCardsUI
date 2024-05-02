import { Component, Input } from '@angular/core';
import { Card, CardPosition } from '@shared/models';
import { BehaviorSubject } from 'rxjs';
import { getPositionNotation } from 'shared/lib/logic/lib/get-position-notation';

@Component({
  selector: 'card-stack',
  templateUrl: './card-stack.component.html',
  styleUrl: './card-stack.component.scss',
})
export class CardStackComponent {
  @Input() cardStack: Card[] | null = [];
  @Input() cardSize: number = 64;
  @Input() set position(position: CardPosition | null) {
    this.positionNotation$.next(getPositionNotation(position));
  }

  readonly positionNotation$ = new BehaviorSubject<string | null>(null);
}
