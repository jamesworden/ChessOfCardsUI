import { Component, Input, HostBinding, inject } from '@angular/core';
import { Card } from '../../../../models/card.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { getCardImageFileName } from 'projects/client/src/app/util/get-asset-file-names';
import { BehaviorSubject, combineLatest, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getCardTiltDegrees } from '../../logic/get-card-tilt-degrees';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly TIMER_BUFFER = 100;

  /*
   * When rearranging cards inside player hand, sometimes multiple card
   * images that are dragged end up in the same single card component host
   * element. When this happens, display: flex horisontally spaces them out.
   */
  @HostBinding('style.display') get display() {
    return this.insideVerticalContainer ? 'block' : 'flex';
  }

  @Input() set rotationDurationMs(rotationDurationMs: number) {
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
  readonly rotationDurationMs$ = new BehaviorSubject<number>(0);
  readonly isHost$ = new BehaviorSubject<boolean | null>(null);
  readonly rowIndex$ = new BehaviorSubject<number | null>(null);
  readonly card$ = new BehaviorSubject<Card | null>(null);

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

  /**
   * Unfortunately, I couldn't figure out how to immediately load two values into this
   * observable if a duration > 0 was specified AND have CSS transition between them.
   * To resolve this, I add a hardcoded delay to make CSS transition register the change.
   */
  readonly rotationAfterDurationApplied$ = combineLatest([
    this.rotationDurationMs$,
    this.rotationDegrees$,
  ]).pipe(
    switchMap(([durationMs, degrees]) => {
      if (durationMs === 0) {
        return [degrees];
      } else {
        return timer(this.TIMER_BUFFER).pipe(map(() => degrees));
      }
    })
  );

  readonly imageFileName$ = this.card$.pipe(
    map((card) => (card ? getCardImageFileName(card) : ''))
  );
}
