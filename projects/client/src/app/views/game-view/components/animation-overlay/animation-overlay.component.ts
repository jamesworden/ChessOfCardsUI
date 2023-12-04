import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Z_INDEXES } from '../../z-indexes';
import { AnimatedEntity } from './models/animated-entity.model';
import { BehaviorSubject } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { getTotalAnimatedEntitiesDurationMs } from './logic/get-total-animated-entities-duration-ms';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { AnimationType } from './models/animation-type.model';
import { getSequencesToDelayMs } from './logic/get-sequences-to-delay-ms';

@Component({
  selector: 'app-animation-overlay',
  templateUrl: './animation-overlay.component.html',
  styleUrl: './animation-overlay.component.css',
  animations: [
    trigger('cardMovement', [
      state(
        'inactive',
        style({
          transform: 'translate3d({{fromX}}px, {{fromY}}px, 0)',
          display: 'none',
        }),
        {
          params: {
            fromX: 0,
            fromY: 0,
          },
        }
      ),
      state(
        'active',
        style({
          transform: 'translate3d({{toX}}px, {{toY}}px, 0)',
          display: 'flex',
        }),
        {
          params: {
            toX: 0,
            toY: 0,
          },
        }
      ),
      transition('inactive => active', animate('{{durationMs}}ms ease-in-out')),
      transition('* => active', animate('{{durationMs}}ms ease-in-out')),
    ]),
  ],
})
export class AnimationOverlayComponent implements OnInit, OnDestroy {
  private readonly sm = new SubscriptionManager();

  readonly Z_INDEXES = Z_INDEXES;
  readonly AnimationType = AnimationType;

  @Input() set animatedEntities(animatedEntities: AnimatedEntity<unknown>[]) {
    this.totalAnimatedEntitesDuration$.next(
      getTotalAnimatedEntitiesDurationMs(animatedEntities)
    );
    this.sequencesToDelayMs$.next(getSequencesToDelayMs(animatedEntities));
    this.isAnimating$.next(true);
    this.animatedEntities$.next(animatedEntities);
    this.currentSequence$.next(null);
  }

  @Output() finishedAnimating = new EventEmitter();

  readonly isAnimating$ = new BehaviorSubject<boolean>(false);
  readonly animatedEntities$ = new BehaviorSubject<AnimatedEntity<unknown>[]>(
    []
  );
  readonly totalAnimatedEntitesDuration$ = new BehaviorSubject<number>(0);
  readonly sequencesToDelayMs$ = new BehaviorSubject<{ [key: number]: number }>(
    {}
  );
  readonly currentSequence$ = new BehaviorSubject<number | null>(null);

  ngOnInit() {
    this.sm.add(
      this.currentSequence$.subscribe((currentSequence) => {
        if (currentSequence === null) {
          this.currentSequence$.next(0);
          return;
        }

        const delayMs = this.sequencesToDelayMs$.getValue()[currentSequence];

        if (delayMs) {
          setTimeout(() => {
            this.currentSequence$.next(currentSequence + 1);
          }, delayMs);
        }
      })
    );

    this.sm.add(
      this.totalAnimatedEntitesDuration$.subscribe((durationMs) => {
        setTimeout(() => {
          this.finishedAnimating.emit();
          this.isAnimating$.next(false);
        }, durationMs);
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
