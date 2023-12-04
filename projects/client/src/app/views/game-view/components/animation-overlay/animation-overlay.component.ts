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
import { map } from 'rxjs/operators';
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
      state('inactive', style({ transform: 'translateX(0)' })),
      state('active', style({ transform: 'translateX(400px)' })),
      transition(
        'inactive => active',
        animate('1000ms {{delayMs}}ms ease-out')
      ),
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
    this.currentSequence$.next(0);
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
  readonly currentSequence$ = new BehaviorSubject<number>(0);

  ngOnInit() {
    this.sm.add(
      this.currentSequence$.subscribe((currentSequence) => {
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
