import { Component, Input, HostBinding, inject } from '@angular/core';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { getCardImageFileName } from 'projects/client/src/app/util/get-asset-file-names';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from '@client/models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  /*
   * When rearranging cards inside player hand, sometimes multiple card
   * images that are dragged end up in the same single card component host
   * element. When this happens, display: flex horisontally spaces them out.
   */
  @HostBinding('style.display') get display() {
    return this.insideVerticalContainer ? 'block' : 'flex';
  }

  @Input({ required: true }) set card(card: Card) {
    this.card$.next(card);
  }
  @Input() playerCanDrag = false;
  @Input() insideVerticalContainer = false;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly card$ = new BehaviorSubject<Card | null>(null);
  readonly imageFileName$ = this.card$.pipe(
    map((card) => (card ? getCardImageFileName(card) : ''))
  );
  readonly cardStyles$ = combineLatest([this.card$, this.cardSize$]).pipe(
    map(([card, cardSize]) => {
      return Object.assign(
        {
          height: cardSize + 'px',
          width: cardSize + 'px',
        },
        card?.customStyles ?? {}
      );
    })
  );
}
