import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  inject,
} from '@angular/core';
import { Card } from 'projects/client/src/app/models/card.model';
import { getCardImageFileName as getCardImageFileNameFn } from '../../../../util/get-asset-file-names';
import { Observable, timer, BehaviorSubject, Subject } from 'rxjs';
import { GameState } from 'projects/client/src/app/state/game.state';
import { Select } from '@ngxs/store';
import { takeUntil, repeatWhen } from 'rxjs/operators';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
} from '@angular/animations';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.css'],
  animations: [
    trigger('bounceCards', [
      transition(
        'not-bouncing => bouncing',
        [
          query('app-card', [
            style({ transform: 'none' }),
            stagger(150, [
              animate(
                '100ms ease',
                style({ transform: 'translateY({{ heightPx }}px)' })
              ),
              animate('100ms ease', style({ transform: 'none' })),
            ]),
          ]),
        ],
        {
          params: {
            heightPx: 0,
          },
        }
      ),
    ]),
  ],
})
export class PlayerHandComponent implements OnInit, OnChanges, OnDestroy {
  private readonly sm = new SubscriptionManager();

  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Input() isPlacingMultipleCards = false;
  @Input() isHost: boolean;
  @Input() cards: Card[];
  @Input() cardSize: number;
  @Input() disabled = true;
  @Output() cardDropped = new EventEmitter<CdkDragDrop<string>>();

  @Select(GameState.placeMultipleCardsHand)
  placeMultipleCardsHand$!: Observable<Card[] | null>;

  readonly getCardImageFileName = getCardImageFileNameFn;
  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly bouncingCards$ = new BehaviorSubject(false);
  readonly disabled$ = new BehaviorSubject(true);
  readonly stopBounceTimer$ = new Subject();
  readonly startBounceTimer$ = new Subject();

  ngOnChanges() {
    this.updateBounceTimer();
  }

  ngOnInit() {
    this.sm.add(
      timer(10000, 5000)
        .pipe(
          takeUntil(this.stopBounceTimer$),
          repeatWhen(() => this.startBounceTimer$)
        )
        .subscribe(() => {
          this.bouncingCards$.next(false);

          setTimeout(() => {
            this.bouncingCards$.next(true);
          });
        })
    );

    this.updateBounceTimer();
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  onCardDrop(event: CdkDragDrop<string>) {
    this.cardDropped.emit(event);
  }

  private updateBounceTimer() {
    if (this.disabled) {
      this.stopBounceTimer$.next();
    } else {
      this.startBounceTimer$.next();
    }
  }
}
