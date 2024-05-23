import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { AnimatedEntity } from './models/animated-entity.model';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnimationType } from './models/animation-type.model';
import { getSequencesToDelayMs } from './logic/get-sequences-to-delay-ms';
import { map } from 'rxjs/operators';
import { movementAnimation } from './animations/movement.animation';
import { fadeOutAnimation } from './animations/fade-out.animation';
import { fadeInAnimation } from './animations/fade-in.animation';
import { Z_INDEXES } from '@shared/constants';
import { rotationAnimation } from './animations/rotation.animation';
import { AudioCacheService } from '@shared/audio-cache';

@Component({
  selector: 'animation-overlay',
  templateUrl: './animation-overlay.component.html',
  styleUrl: './animation-overlay.component.scss',
  animations: [
    movementAnimation,
    fadeOutAnimation,
    fadeInAnimation,
    rotationAnimation,
  ],
})
export class AnimationOverlayComponent implements OnInit {
  readonly Z_INDEXES = Z_INDEXES;
  readonly AnimationType = AnimationType;
  readonly APPLY_ROTATION_DELAY = 50;

  readonly #destroyRef = inject(DestroyRef);
  readonly #audioCacheService = inject(AudioCacheService);

  @Input() playSounds = true;
  @Input({ required: true }) set animatedEntities(
    animatedEntities: AnimatedEntity<unknown>[]
  ) {
    this.animatedEntities$.next(animatedEntities);
  }

  @Output() finishedAnimations = new EventEmitter<AnimatedEntity<unknown>[]>();
  @Output() startingAnimations = new EventEmitter<AnimatedEntity<unknown>[]>();

  readonly appliedRotation$ = new BehaviorSubject<boolean>(false);
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
    this.sequencesWithDelays$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((sequencesWithDelays) =>
        this.updateCurrentSequence(sequencesWithDelays)
      );
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
      this.finishedAnimations.emit(this.animatedEntities$.getValue());
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

    if (this.playSounds) {
      this.playStartingAnimationSounds(currentEntities);
    }

    /** [Animation Overlay Documenation] [LAN-308] */
    const correctedDelayMs = delay - 25;

    setTimeout(() => {
      this.appliedRotation$.next(false);
      this.updateCurrentSequence(sequencesWithDelays, initialIndex + 1);
    }, correctedDelayMs);

    /**
     * If the entity initially renders in as being 'rotated', the animation never happens.
     * We must start it out as 'not-rotated' and set it to 'rotated' after a small delay
     * to trigger the animation.
     */
    setTimeout(() => {
      this.appliedRotation$.next(true);
    }, this.APPLY_ROTATION_DELAY);
  }

  private playStartingAnimationSounds<T>(currentEntities: AnimatedEntity<T>[]) {
    const sounds = new Set<HTMLAudioElement>();

    for (const entity of currentEntities) {
      if (entity.soundPaths?.onStart) {
        sounds.add(
          this.#audioCacheService.getAudio(entity.soundPaths?.onStart)
        );
      }
    }

    for (const sound of sounds) {
      sound.play();
    }
  }
}
