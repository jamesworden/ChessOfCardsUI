import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  inject,
  DestroyRef,
} from '@angular/core';
import { Card } from 'projects/client/src/app/models/card.model';
import { Observable, timer, BehaviorSubject, Subject } from 'rxjs';
import { GameState } from 'projects/client/src/app/state/game.state';
import { Select } from '@ngxs/store';
import { takeUntil, repeatWhen } from 'rxjs/operators';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { bounceCardAnimation } from './bounce-cards.animation';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
  animations: [bounceCardAnimation],
})
export class PlayerHandComponent implements OnInit, OnChanges {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #destroyRef = inject(DestroyRef);

  @Input() isPlacingMultipleCards = false;
  @Input({ required: true }) isHost: boolean;
  @Input({ required: true }) cards: Card[];
  @Input({ required: true }) cardSize: number;
  @Input() disabled = true;
  @Output() cardDropped = new EventEmitter<CdkDragDrop<string>>();

  @Select(GameState.placeMultipleCardsHand)
  placeMultipleCardsHand$!: Observable<Card[] | null>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly bouncingCards$ = new BehaviorSubject(false);
  readonly disabled$ = new BehaviorSubject(true);
  readonly stopBounceTimer$ = new Subject();
  readonly startBounceTimer$ = new Subject();

  ngOnChanges() {
    this.resetBounceTimer();
  }

  ngOnInit() {
    timer(10000, 5000)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        takeUntil(this.stopBounceTimer$),
        repeatWhen(() => this.startBounceTimer$)
      )
      .subscribe(() => {
        this.bouncingCards$.next(false);

        setTimeout(() => {
          this.bouncingCards$.next(true);
        });
      });

    this.resetBounceTimer();
  }

  onCardDrop(event: CdkDragDrop<string>) {
    this.cardDropped.emit(event);
    this.resetBounceTimer();
  }

  resetBounceTimer() {
    this.stopBounceTimer$.next();

    if (!this.disabled) {
      this.startBounceTimer$.next();
    }
  }
}
