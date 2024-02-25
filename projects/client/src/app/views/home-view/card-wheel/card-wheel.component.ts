import { Component, Input, inject } from '@angular/core';
import { Card } from '../../../models/card.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponsiveSizeService } from '../../game-view/services/responsive-size.service';

@Component({
  selector: 'app-card-wheel',
  templateUrl: './card-wheel.component.html',
  styleUrl: './card-wheel.component.css',
})
export class CardWheelComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Input() set cards(cards: Card[]) {
    this.cards$.next(cards);
  }

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly cards$ = new BehaviorSubject<Card[]>([]);
  readonly rotationPerCard$ = this.cards$.pipe(
    map((cards) => 360 / cards.length)
  );
}
