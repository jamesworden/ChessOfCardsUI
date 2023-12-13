import { Component, Input, HostBinding, inject } from '@angular/core';
import { Card } from '../../../../models/card.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { getCardImageFileName } from 'projects/client/src/app/util/get-asset-file-names';
import { BehaviorSubject, combineLatest, timer } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { getCardTiltDegrees } from '../../logic/get-card-tilt-degrees';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  /**
   * TODO: Explain.
   */
  readonly TIMER_BUFFER_MS = 50;

  /*
   * When rearranging cards inside player hand, sometimes multiple card
   * images that are dragged end up in the same single card component host
   * element. When this happens, display: flex horisontally spaces them out.
   */
  @HostBinding('style.display') get display() {
    return this.insideVerticalContainer ? 'block' : 'flex';
  }

  @Input({ required: true }) set rotationDurationMs(
    rotationDurationMs: number
  ) {
    this.rotationDurationMs$.next(rotationDurationMs);
  }
  @Input() playerCanDrag = false;
  @Input() set card(card: Card) {
    this.card$.next(card);
  }
  @Input() set isHost(isHost: boolean) {
    this.isHost$.next(isHost);
  }
  @Input() set rowIndex(rowIndex: number) {
    this.rowIndex$.next(rowIndex);
  }
  @Input() wonBy: PlayerOrNone;
  @Input() insideVerticalContainer: boolean = false;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly rotationDurationMs$ = new BehaviorSubject<number | null>(null);
  readonly isHost$ = new BehaviorSubject<boolean | null>(null);
  readonly rowIndex$ = new BehaviorSubject<number | null>(null);
  readonly card$ = new BehaviorSubject<Card | null>(null);

  rotationDegrees: number = 0;

  readonly rotationDegrees$ = combineLatest([
    this.card$,
    this.rowIndex$,
    this.isHost$,
  ]).pipe(
    map(([card, rowIndex, isHost]) =>
      card && rowIndex !== null && isHost !== null
        ? getCardTiltDegrees(card, rowIndex, isHost)
        : 0
    )
  );

  readonly imageFileName$ = this.card$.pipe(
    map((card) => (card ? getCardImageFileName(card) : ''))
  );

  constructor() {
    combineLatest([
      this.rotationDurationMs$.pipe(filter((duration) => duration !== null)),
      this.rotationDegrees$,
    ]).subscribe(([durationMs, degrees]) => {
      if (durationMs === 0) {
        this.rotationDegrees = degrees;
      } else {
        setTimeout(() => {
          this.rotationDegrees = degrees;
        }, 200);
      }
    });
  }
}
