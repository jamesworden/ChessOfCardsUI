import {
  Component,
  Input,
  HostBinding,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from '@shared/models';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { getCardImageFileName } from './get-card-image-file-name';

@Component({
  selector: 'game-card',
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
  @Input() disabled = false;

  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<void>();

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

  onDragStarted() {
    this.dragStarted.emit();
  }

  onDragEnded() {
    this.dragEnded.emit();
  }
}
