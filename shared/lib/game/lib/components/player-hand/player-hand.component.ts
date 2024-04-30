import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { Card } from '@shared/models';
import { Observable, timer, BehaviorSubject, of, combineLatest } from 'rxjs';
import { switchMap, filter, delay, map } from 'rxjs/operators';
import { ResponsiveSizeService } from '@shared/game';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { bounceCardAnimation } from './bounce-cards.animation';

@Component({
  selector: 'game-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
  animations: [bounceCardAnimation],
})
export class PlayerHandComponent implements OnInit {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #destroyRef = inject(DestroyRef);

  @Input({ required: true }) isHost: boolean;
  @Input({ required: true }) cardSize: number;
  @Input() disabled = true;

  @Input({ required: true }) set placeMultipleCardsHand(
    placeMultipleCardsHand: Card[] | null
  ) {
    this.placeMultipleCardsHand$.next(placeMultipleCardsHand);
  }
  @Input({ required: true }) set isPlayersTurn(isPlayersTurn: boolean) {
    this.isPlayersTurn$.next(isPlayersTurn);
  }
  @Input({ required: true }) set isGameActive(isGameActive: boolean) {
    this.isGameActive$.next(isGameActive);
  }
  @Input({ required: true }) set cards(cards: Card[]) {
    this.cards$.next(cards);
  }
  @Input({ required: true }) set isPlacingMultipleCards(
    isPlacingMultipleCards: boolean
  ) {
    this.isPlacingMultipleCards$.next(isPlacingMultipleCards);
  }

  @Output() cardDropped = new EventEmitter<CdkDragDrop<string>>();

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly bouncingCards$ = new BehaviorSubject(false);
  readonly disabled$ = new BehaviorSubject(true);
  readonly isPlayersTurn$ = new BehaviorSubject<boolean>(false);
  readonly isGameActive$ = new BehaviorSubject<boolean>(false);
  readonly cards$ = new BehaviorSubject<Card[]>([]);
  readonly placeMultipleCardsHand$ = new BehaviorSubject<Card[] | null>(null);
  readonly isPlacingMultipleCards$ = new BehaviorSubject<boolean>(false);
  readonly bounceTimer$ = new BehaviorSubject<Observable<number | null>>(
    of(null)
  );

  readonly allCards$ = combineLatest([
    this.cards$,
    this.placeMultipleCardsHand$,
    this.isPlacingMultipleCards$,
  ]).pipe(
    map(([cards, placeMultipleCardsHand, isPlacingMultipleCards]) =>
      isPlacingMultipleCards ? placeMultipleCardsHand : cards
    )
  );

  ngOnInit() {
    this.bounceTimer$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        switchMap((timer) => timer),
        filter((x) => typeof x === 'number')
      )
      .subscribe(() => this.brieflyApplyBounceClass());

    combineLatest([this.isPlayersTurn$, this.isGameActive$, this.allCards$])
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(([isPlayersTurn, isGameActive, allCards]) =>
        isPlayersTurn && isGameActive && allCards && allCards.length > 0
          ? this.startBounceTimer()
          : this.stopBounceTimer()
      );

    this.bouncingCards$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter((bouncingCards) => bouncingCards),
        delay(1000)
      )
      .subscribe(() => this.bouncingCards$.next(false));
  }

  onCardDrop(event: CdkDragDrop<string>) {
    this.cardDropped.emit(event);
  }

  resetBounceTimerIfPlayersTurn() {
    const isPlayersTurn = this.isPlayersTurn$.getValue();
    if (isPlayersTurn) {
      this.startBounceTimer();
    }
  }

  startBounceTimer() {
    this.bounceTimer$.next(timer(10000, 5000));
  }

  stopBounceTimer() {
    this.bounceTimer$.next(of(null));
  }

  brieflyApplyBounceClass() {
    this.bouncingCards$.next(true);
  }
}
