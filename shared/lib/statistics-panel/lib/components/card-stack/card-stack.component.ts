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
  @Input({ required: true }) cardStack: Card[] | null = [];
  @Input({ required: true }) cardSize: number = 64;
  @Input({ required: true }) redJokerLaneIndex: number | null;
  @Input({ required: true }) blackJokerLaneIndex: number | null;
  @Input() isGameActive = true;
  @Input({ required: true }) set position(position: CardPosition | null) {
    this.position$.next(position);
    this.positionNotation$.next(getPositionNotation(position));
  }

  readonly positionNotation$ = new BehaviorSubject<string | null>(null);
  readonly position$ = new BehaviorSubject<CardPosition | null>(null);
}
