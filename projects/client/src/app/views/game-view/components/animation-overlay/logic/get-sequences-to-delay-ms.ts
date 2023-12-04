import { AnimatedEntity } from '../models/animated-entity.model';

export function getSequencesToDelayMs(
  animatedEntities: AnimatedEntity<unknown>[]
) {
  const sequencesToDelayMs: {
    [key: number]: number;
  } = {};

  for (const animatedEntity of animatedEntities) {
    if (
      animatedEntity.movement.durationMs >
      (sequencesToDelayMs[animatedEntity.movement.sequence] ?? 0)
    ) {
      sequencesToDelayMs[animatedEntity.movement.sequence] =
        animatedEntity.movement.durationMs;
    }
  }

  return sequencesToDelayMs;
}
