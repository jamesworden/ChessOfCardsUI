import { AnimatedPosition } from './animated-position.model';

export type AnimatedMovement = {
  from?: AnimatedPosition;
  to?: AnimatedPosition;
  durationMs: number;
  sequence: number;
};
