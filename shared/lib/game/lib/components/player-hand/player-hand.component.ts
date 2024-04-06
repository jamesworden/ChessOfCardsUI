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
import { Observable, timer, BehaviorSubject, of } from 'rxjs';
import { GameState } from 'projects/client/src/app/state/game.state';
import { Select, Store } from '@ngxs/store';
import { switchMap, filter, delay } from 'rxjs/operators';
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
  readonly #store = inject(Store);

  @Input() isPlacingMultipleCards = false;
  @Input({ required: true }) isHost: boolean;
  @Input({ required: true }) cards: Card[];
  @Input({ required: true }) cardSize: number;
  @Input() disabled = true;
  @Output() cardDropped = new EventEmitter<CdkDragDrop<string>>();

  @Select(GameState.placeMultipleCardsHand)
  placeMultipleCardsHand$!: Observable<Card[] | null>;

  @Select(GameState.isPlayersTurn)
  isPlayersTurn$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly bouncingCards$ = new BehaviorSubject(false);
  readonly disabled$ = new BehaviorSubject(true);

  bounceTimer$ = new BehaviorSubject<Observable<number | null>>(of(null));

  ngOnInit() {
    this.bounceTimer$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        switchMap((timer) => timer),
        filter((x) => typeof x === 'number')
      )
      .subscribe(() => this.brieflyApplyBounceClass());

    this.isPlayersTurn$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((isPlayersTurn) =>
        isPlayersTurn ? this.startBounceTimer() : this.stopBounceTimer()
      );

    this.bouncingCards$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter((x) => x),
        delay(1000)
      )
      .subscribe(() => this.bouncingCards$.next(false));
  }

  onCardDrop(event: CdkDragDrop<string>) {
    this.cardDropped.emit(event);
  }

  resetBounceTimerIfPlayersTurn() {
    const isPlayersTurn = this.#store.selectSnapshot(GameState.isPlayersTurn);
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
