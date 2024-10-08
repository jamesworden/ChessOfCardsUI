import { SoundPaths } from '@shared/animation-overlay';
import { CardMovement } from '@shared/models';

export function getCardMovementSoundPaths(
  cardMovement: CardMovement,
  durationMs: number
) {
  const soundPaths: SoundPaths = {};

  if (cardMovement.from && cardMovement.to && durationMs > 0) {
    soundPaths.onStart = 'assets/sounds/slide_card.mp3';
  }

  return soundPaths;
}
