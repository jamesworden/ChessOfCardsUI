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
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-animation-overlay',
  templateUrl: './animation-overlay.component.html',
  styleUrl: './animation-overlay.component.css',
  animations: [
    trigger('cardMovement', [
      state(
        'todo',
        style({
          top: '{{fromY}}px',
          left: '{{fromX}}px',
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
          top: '{{toY}}px',
          left: '{{toX}}px',
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
          top: '{{toY}}px',
          left: '{{toX}}px',
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
    trigger('fadeOut', [
      state(
        'todo',
        style({
          top: '{{y}}px',
          left: '{{x}}px',
          opacity: 1,
        }),
        {
          params: {
            x: 0,
            y: 0,
          },
        }
      ),
      state(
        'in-progress',
        style({
          top: '{{y}}px',
          left: '{{x}}px',
          opacity: 0,
        }),
        {
          params: {
            x: 0,
            y: 0,
          },
        }
      ),
      state(
        'completed',
        style({
          top: '{{y}}px',
          left: '{{x}}px',
          opacity: 0,
        }),
        {
          params: {
            x: 0,
            y: 0,
          },
        }
      ),
      transition('* => in-progress', animate('{{durationMs}}ms ease-in-out')),
    ]),

    trigger('fadeIn', [
      state(
        'todo',
        style({
          top: '{{y}}px',
          left: '{{x}}px',
          opacity: 0,
        }),
        {
          params: {
            x: 0,
            y: 0,
          },
        }
      ),
      state(
        'in-progress',
        style({
          top: '{{y}}px',
          left: '{{x}}px',
          opacity: 1,
        }),
        {
          params: {
            x: 0,
            y: 0,
          },
        }
      ),
      state(
        'completed',
        style({
          top: '{{y}}px',
          left: '{{x}}px',
          opacity: 1,
        }),
        {
          params: {
            x: 0,
            y: 0,
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
    this.animatedEntities$.next(animatedEntities);
  }

  @Output() finishedAnimations = new EventEmitter();
  @Output() startingAnimations = new EventEmitter<AnimatedEntity<unknown>[]>();

  readonly animatedEntities$ = new BehaviorSubject<AnimatedEntity<unknown>[]>(
    []
  );
  readonly sequencesToDelayMs$ = this.animatedEntities$.pipe(
    map(getSequencesToDelayMs)
  );
  readonly sequencesWithDelays$ = this.sequencesToDelayMs$.pipe(
    map((delayDictionary) => {
      const sequenceArray = Object.entries(delayDictionary).map(
        ([sequence, delay]) => ({
          sequence: parseInt(sequence),
          delay,
        })
      );
      sequenceArray.unshift({
        sequence: -1,
        delay: 0,
      });
      return sequenceArray;
    })
  );
  readonly currentSequence$ = new BehaviorSubject<number | null>(null);

  ngOnInit() {
    this.sm.add(
      this.sequencesWithDelays$.subscribe((sequencesWithDelays) =>
        this.updateCurrentSequence(sequencesWithDelays)
      )
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  updateCurrentSequence(
    sequencesWithDelays: {
      sequence: number;
      delay: number;
    }[],
    initialIndex = 0
  ) {
    const sequenceWithDelays = sequencesWithDelays[initialIndex];

    if (!sequenceWithDelays) {
      this.finishedAnimations.emit();
      this.currentSequence$.next(null);
      return;
    }

    const { sequence, delay } = sequenceWithDelays;
    const animatedEntities = this.animatedEntities$.getValue();
    const currentEntities = animatedEntities.filter(
      (animatedEntity) => animatedEntity.movement.sequence === sequence
    );

    if (currentEntities.length > 0) {
      this.startingAnimations.next(currentEntities);
    }

    this.currentSequence$.next(sequence);

    setTimeout(() => {
      this.updateCurrentSequence(sequencesWithDelays, initialIndex + 1);
    }, delay);
  }
}
