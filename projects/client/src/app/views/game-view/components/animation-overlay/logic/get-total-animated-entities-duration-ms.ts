import { AnimatedEntity } from '../models/animated-entity.model';

export function getTotalAnimatedEntitiesDurationMs(
  animatedEntities: AnimatedEntity<unknown>[]
) {
  const sequencesToHighestMs = new Map<number, number>();

  for (const animatedEntity of animatedEntities) {
    const existingMs = sequencesToHighestMs.get(
      animatedEntity.movement.sequence
    );

    if (animatedEntity.movement.durationMs > (existingMs ?? 0)) {
      sequencesToHighestMs.set(
        animatedEntity.movement.sequence,
        animatedEntity.movement.durationMs
      );
    }
  }

  let durationMs = 0;

  for (const [_, highestMs] of sequencesToHighestMs.entries()) {
    durationMs += highestMs;
  }

  return durationMs;
}
