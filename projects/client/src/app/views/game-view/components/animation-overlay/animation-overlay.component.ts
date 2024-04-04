import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
  DestroyRef
} from '@angular/core';
import { Z_INDEXES } from '../../z-indexes';
import { AnimatedEntity } from './models/animated-entity.model';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnimationType } from './models/animation-type.model';
import { getSequencesToDelayMs } from './logic/get-sequences-to-delay-ms';
import { map } from 'rxjs/operators';
import { cardMovementAnimation } from './animations/card-movement.animation';
import { fadeOutAnimation } from './animations/fade-out.animation';
import { fadeInAnimation } from './animations/fade-in.animation';

@Component({
  selector: 'app-animation-overlay',
  templateUrl: './animation-overlay.component.html',
  styleUrl: './animation-overlay.component.scss',
  animations: [
    cardMovementAnimation,
    fadeOutAnimation,
    fadeInAnimation
  ],
})
export class AnimationOverlayComponent implements OnInit {
  readonly Z_INDEXES = Z_INDEXES;
  readonly AnimationType = AnimationType;

  readonly #destroyRef = inject(DestroyRef);

  @Input({ required: true }) set animatedEntities(
    animatedEntities: AnimatedEntity<unknown>[]
  ) {
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
    this.sequencesWithDelays$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((sequencesWithDelays) =>
        this.updateCurrentSequence(sequencesWithDelays)
      )
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
      this.startingAnimations.emit(currentEntities);
    }

    this.currentSequence$.next(sequence);

    setTimeout(() => {
      this.updateCurrentSequence(sequencesWithDelays, initialIndex + 1);
    }, delay);
  }
}
