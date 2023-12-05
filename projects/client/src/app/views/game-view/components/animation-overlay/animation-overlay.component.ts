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
        'todo',
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
        'in-progress',
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
      state(
        'completed',
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
      transition('* => in-progress', animate('{{durationMs}}ms ease-in-out')),
    ]),
  ],
})
export class AnimationOverlayComponent implements OnInit, OnDestroy {
  private readonly sm = new SubscriptionManager();

  readonly Z_INDEXES = Z_INDEXES;
  readonly AnimationType = AnimationType;

  @Input() set animatedEntities(animatedEntities: AnimatedEntity<unknown>[]) {
    this.sequencesToDelayMs$.next(getSequencesToDelayMs(animatedEntities));
    this.isAnimating$.next(true);
    this.animatedEntities$.next(animatedEntities);
    this.currentSequence$.next(-1);
  }

  @Output() finishedAnimating = new EventEmitter();

  readonly isAnimating$ = new BehaviorSubject<boolean>(false);
  readonly animatedEntities$ = new BehaviorSubject<AnimatedEntity<unknown>[]>(
    []
  );
  readonly sequencesToDelayMs$ = new BehaviorSubject<{ [key: number]: number }>(
    {}
  );
  readonly currentSequence$ = new BehaviorSubject<number>(-1);

  ngOnInit() {
    this.sm.add(
      this.currentSequence$.subscribe((currentSequence) => {
        // When the current sequence is < 0, it allows all cards to initially be rendered
        // in their 'from' position so angular can properly tween into the 'to' position.
        if (currentSequence < 0) {
          setTimeout(() => {
            this.currentSequence$.next(currentSequence + 1);
          });
          return;
        }

        const delayMs = this.sequencesToDelayMs$.getValue()[currentSequence];
        if (delayMs) {
          setTimeout(() => {
            this.currentSequence$.next(currentSequence + 1);
          }, delayMs);
          return;
        }

        this.finishedAnimating.emit();
        this.isAnimating$.next(false);
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
